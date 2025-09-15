import { Pill, Clock, Camera, Volume2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  times: string[];
  nextDose: string;
  remainingPills: number;
  instructions: string;
}

interface MedicationCardProps {
  medication: Medication;
  onPlayReminder: (medication: Medication) => void;
  onUploadImage: () => void;
}

const MedicationCard = ({ medication, onPlayReminder, onUploadImage }: MedicationCardProps) => {
  const isTimeToTake = () => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return medication.times.includes(currentTime);
  };

  return (
    <Card className={`shadow-card hover:shadow-soft transition-all duration-300 ${isTimeToTake() ? 'ring-2 ring-primary shadow-glow' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Pill className="h-5 w-5 text-primary" />
            <span>{medication.name}</span>
          </CardTitle>
          {isTimeToTake() && (
            <Badge className="bg-primary text-primary-foreground animate-pulse">
              Time to take!
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-foreground">Dosage: {medication.dosage}</p>
          <p className="text-xs text-muted-foreground">{medication.instructions}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">Times: {medication.times.join(", ")}</p>
            <p className="text-xs text-muted-foreground">Next dose: {medication.nextDose}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">Remaining: {medication.remainingPills} pills</p>
            <div className="w-full bg-muted rounded-full h-2 mt-1">
              <div 
                className="bg-primary rounded-full h-2 transition-all duration-300" 
                style={{ width: `${Math.min((medication.remainingPills / 30) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onPlayReminder(medication)}
            className="flex-1"
          >
            <Volume2 className="h-4 w-4 mr-2" />
            Voice Reminder
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onUploadImage}
            className="flex-1"
          >
            <Camera className="h-4 w-4 mr-2" />
            Upload Photo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationCard;