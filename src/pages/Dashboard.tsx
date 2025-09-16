import { useState } from "react";
import { Calendar, Pill, Users, AlertTriangle } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import NavigationSidebar from "@/components/dashboard/NavigationSidebar";
import StatCard from "@/components/dashboard/StatCard";
import AppointmentCard from "@/components/dashboard/AppointmentCard";
import MedicationCard from "@/components/dashboard/MedicationCard";
import PatientDetailsForm from "@/components/forms/PatientDetailsForm";
import LocationModal from "@/components/maps/LocationModal";
import LocationMap from "@/components/maps/LocationMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data
const stats = [
  { title: "Upcoming Appointments", value: "3", icon: Calendar, trend: "Next: Today 2:00 PM", color: "primary" as const },
  { title: "Active Medications", value: "5", icon: Pill, trend: "2 due today", color: "secondary" as const },
  { title: "Patients", value: "2", icon: Users, trend: "Active care plans", color: "success" as const },
  { title: "Pending Alerts", value: "2", icon: AlertTriangle, trend: "Medication reminders", color: "warning" as const },
];

const appointments = [
  {
    id: "1",
    patientName: "Eleanor Johnson",
    doctorName: "Sarah Wilson",
    date: "Today, Oct 15",
    time: "2:00 PM",
    location: "St. Mary's Hospital, 123 Health St, City",
    type: "Cardiology Checkup",
    status: "confirmed" as const
  },
  {
    id: "2",
    patientName: "Robert Smith",
    doctorName: "Michael Chen",
    date: "Tomorrow, Oct 16",
    time: "10:30 AM",
    location: "Downtown Medical Center, 456 Care Ave, City",
    type: "Physical Therapy",
    status: "upcoming" as const
  }
];

const medications = [
  {
    id: "1",
    name: "Lisinopril",
    dosage: "10mg",
    times: ["08:00", "20:00"],
    nextDose: "8:00 PM",
    remainingPills: 25,
    instructions: "Take with food"
  },
  {
    id: "2",
    name: "Metformin",
    dosage: "500mg",
    times: ["08:00", "12:00", "18:00"],
    nextDose: "6:00 PM",
    remainingPills: 15,
    instructions: "Take with meals"
  }
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const handleViewLocation = (appointment: any) => {
    setSelectedLocation({
      name: appointment.type,
      address: appointment.location,
      patientName: appointment.patientName,
      type: appointment.type,
      time: `${appointment.date} at ${appointment.time}`,
    });
    setIsLocationModalOpen(true);
  };

  const handlePlayReminder = (medication: any) => {
    // Voice reminder functionality - will be enhanced with ElevenLabs
    const utterance = new SpeechSynthesisUtterance(
      `Time to take your ${medication.name}, ${medication.dosage}. ${medication.instructions}`
    );
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    speechSynthesis.speak(utterance);
  };

  const handleUploadImage = () => {
    // Image upload functionality for medication recognition
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('Selected file:', file);
        // TODO: Implement image processing for medication recognition
      }
    };
    input.click();
  };

  const renderDashboardContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Today's Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {appointments.slice(0, 2).map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onViewLocation={handleViewLocation}
                    />
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Medication Reminders
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {medications.slice(0, 2).map((medication) => (
                    <MedicationCard
                      key={medication.id}
                      medication={medication}
                      onPlayReminder={handlePlayReminder}
                      onUploadImage={handleUploadImage}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "appointments":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Appointments</h2>
              <Button className="bg-gradient-primary text-primary-foreground">
                Schedule New Appointment
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onViewLocation={handleViewLocation}
                />
              ))}
            </div>
            
            {/* Map Overview */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Appointment Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LocationMap 
                  locations={appointments.map(apt => ({
                    id: apt.id,
                    name: apt.type,
                    address: apt.location,
                    patientName: apt.patientName,
                    type: apt.type,
                    time: `${apt.date} at ${apt.time}`,
                  }))}
                  className="h-80 w-full"
                />
              </CardContent>
            </Card>
          </div>
        );

      case "medications":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Medications</h2>
              <Button className="bg-gradient-primary text-primary-foreground" onClick={handleUploadImage}>
                Add Medication Photo
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medications.map((medication) => (
                <MedicationCard
                  key={medication.id}
                  medication={medication}
                  onPlayReminder={handlePlayReminder}
                  onUploadImage={handleUploadImage}
                />
              ))}
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Patient Profile</h2>
            </div>
            <PatientDetailsForm />
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <p className="text-muted-foreground">This section is coming soon!</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <DashboardHeader />
      <div className="flex">
        <NavigationSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">
          {renderDashboardContent()}
        </main>
      </div>
      
      {selectedLocation && (
        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          location={selectedLocation}
        />
      )}
    </div>
  );
};

export default Dashboard;