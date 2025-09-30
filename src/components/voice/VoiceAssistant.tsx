import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Play, Pause, Eye, EyeOff, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sql?: string;
  sources?: string[];
  audioUrl?: string;
}

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceAssistant = ({ isOpen, onClose }: VoiceAssistantProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showSql, setShowSql] = useState<Record<string, boolean>>({});
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const { toast } = useToast();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsTranscribing(true);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Convert audio to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      // Call STT function
      const { data: sttData, error: sttError } = await supabase.functions.invoke('voice-stt', {
        body: { audio: base64Audio }
      });

      if (sttError) throw sttError;

      const transcription = sttData.text;
      
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: transcription,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsTranscribing(false);

      // Get assistant response
      await getAssistantResponse(transcription);

    } catch (error) {
      console.error('Error processing audio:', error);
      setIsTranscribing(false);
      toast({
        title: "Transcription Error",
        description: "Could not process audio. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getAssistantResponse = async (query: string) => {
    try {
      const { data: assistantData, error: assistantError } = await supabase.functions.invoke('voice-assistant', {
        body: { 
          query,
          userId: (await supabase.auth.getUser()).data.user?.id 
        }
      });

      if (assistantError) throw assistantError;

      // Generate TTS audio
      const { data: ttsData, error: ttsError } = await supabase.functions.invoke('voice-tts', {
        body: { text: assistantData.response }
      });

      const assistantMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: assistantData.response,
        timestamp: new Date(),
        sql: assistantData.sql,
        sources: assistantData.sources,
        audioUrl: ttsError ? undefined : `data:audio/mp3;base64,${ttsData.audioContent}`,
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error getting assistant response:', error);
      toast({
        title: "Assistant Error",
        description: "Could not get response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const playAudio = async (messageId: string, audioUrl: string) => {
    try {
      if (playingAudio === messageId) {
        audioRef.current?.pause();
        setPlayingAudio(null);
        return;
      }

      if (audioRef.current) {
        audioRef.current.pause();
      }

      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setPlayingAudio(null);
      audioRef.current.onerror = () => {
        setPlayingAudio(null);
        toast({
          title: "Audio Error",
          description: "Could not play audio response.",
          variant: "destructive",
        });
      };

      await audioRef.current.play();
      setPlayingAudio(messageId);
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlayingAudio(null);
    }
  };

  const toggleSqlView = (messageId: string) => {
    setShowSql(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[500px] z-50 shadow-xl border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Voice Assistant</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 h-full flex flex-col">
        <ScrollArea className="flex-1 mb-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`${message.type === 'user' ? 'ml-4' : 'mr-4'}`}>
                <div className={`p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground ml-auto max-w-[80%]' 
                    : 'bg-muted max-w-[90%]'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    
                    {message.type === 'assistant' && (
                      <div className="flex items-center space-x-2">
                        {message.audioUrl && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => playAudio(message.id, message.audioUrl!)}
                          >
                            {playingAudio === message.id ? (
                              <Pause className="h-3 w-3" />
                            ) : (
                              <Play className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                        
                        {message.sql && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => toggleSqlView(message.id)}
                          >
                            {showSql[message.id] ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {message.type === 'assistant' && showSql[message.id] && message.sql && (
                  <div className="mt-2 p-2 bg-card border rounded text-xs">
                    <Badge variant="outline" className="mb-2">SQL Query</Badge>
                    <pre className="whitespace-pre-wrap text-muted-foreground">{message.sql}</pre>
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-2">
                        <Badge variant="outline" className="mb-1">Sources</Badge>
                        <ul className="text-muted-foreground">
                          {message.sources.map((source, idx) => (
                            <li key={idx}>• {source}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {isTranscribing && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm">Transcribing...</span>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <Separator className="mb-4" />
        
        <div className="flex justify-center">
          <Button
            size="lg"
            variant={isRecording ? "destructive" : "default"}
            className="rounded-full w-16 h-16"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isTranscribing}
          >
            {isRecording ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>
        </div>
        
        <p className="text-xs text-center text-muted-foreground mt-2">
          {isRecording ? "Recording... Click to stop" : "Click to start recording"}
        </p>
      </CardContent>
    </Card>
  );
};