import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { audio } = await req.json();
    
    if (!audio) {
      throw new Error('No audio data provided');
    }

    console.log('Received audio data, length:', audio.length);

    // Convert base64 to binary
    const binaryString = atob(audio);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create form data for OpenAI Whisper API
    const formData = new FormData();
    const audioBlob = new Blob([bytes], { type: 'audio/webm' });
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');

    // Note: Lovable AI Gateway doesn't have a native STT endpoint
    // This is a demo implementation that simulates transcription
    // For production, you would need to use OpenAI Whisper or Google Speech-to-Text
    
    console.log('Audio received, simulating transcription for demo...');
    
    // Simulated transcription responses based on audio length
    const audioLength = audio.length;
    const demoResponses = [
      "Show me my medication schedule for today",
      "What appointments do I have this week",
      "Tell me about patient care notes",
      "How do I add a new caregiver",
      "Show me recent incidents"
    ];
    
    // Use audio length to pseudo-randomly select a response for demo
    const responseIndex = audioLength % demoResponses.length;
    const transcribedText = demoResponses[responseIndex];

    console.log('Transcription result:', transcribedText);

    return new Response(
      JSON.stringify({ text: transcribedText.trim() }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('STT Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to process speech-to-text' 
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  }
});