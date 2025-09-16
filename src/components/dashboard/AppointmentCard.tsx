import { Calendar, Clock, MapPin, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  location: string;
  type: string;
  status: "upcoming" | "confirmed" | "completed";
}

interface AppointmentCardProps {
  appointment: Appointment;
  onViewLocation: (appointment: Appointment) => void;
}

const AppointmentCard = ({ appointment, onViewLocation }: AppointmentCardProps) => {
  const statusColors = {
    upcoming: "bg-warning-soft text-warning",
    confirmed: "bg-success-soft text-success",
    completed: "bg-muted text-muted-foreground"
  };

  return (
    <Card className="shadow-card hover:shadow-soft transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            {appointment.type}
          </CardTitle>
          <Badge className={statusColors[appointment.status]}>
            {appointment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">{appointment.patientName}</p>
            <p className="text-xs text-muted-foreground">Patient</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">Dr. {appointment.doctorName}</p>
            <p className="text-xs text-muted-foreground">Doctor</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-foreground">{appointment.date}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-foreground">{appointment.time}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground truncate max-w-32">{appointment.location}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewLocation(appointment)}
            className="text-xs"
          >
            View Map
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;