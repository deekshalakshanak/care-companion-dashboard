import { useState, useEffect } from "react";
import { Calendar, Pill, Users, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import NavigationSidebar from "@/components/dashboard/NavigationSidebar";
import StatCard from "@/components/dashboard/StatCard";
import AppointmentCard from "@/components/dashboard/AppointmentCard";
import MedicationCard from "@/components/dashboard/MedicationCard";
import PatientDetailsForm from "@/components/forms/PatientDetailsForm";
import LocationModal from "@/components/maps/LocationModal";
import LocationMap from "@/components/maps/LocationMap";
import { VoiceAssistant } from "@/components/voice/VoiceAssistant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);

  // Fetch appointments from Supabase
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            id,
            appointment_date,
            status,
            notes,
            latitude,
            longitude,
            elder_id,
            caregiver_id
          `)
          .order('appointment_date', { ascending: true });

        if (error) {
          console.error('Error fetching appointments:', error);
          return;
        }

        // Transform the data to match the expected format
        const transformedAppointments = data?.map(apt => ({
          id: apt.id,
          patientName: "Patient", // You may want to join with users table for real names
          doctorName: "Doctor", // You may want to join with caregivers for real names  
          date: new Date(apt.appointment_date).toLocaleDateString(),
          time: new Date(apt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          location: apt.notes || "Medical Center", // Using notes as location for now
          type: "Medical Appointment",
          status: apt.status || "upcoming",
          latitude: apt.latitude,
          longitude: apt.longitude,
        })) || [];

        setAppointments(transformedAppointments);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Mock data for stats and medications (can be enhanced later)
  const stats = [
    { title: "Upcoming Appointments", value: appointments.length.toString(), icon: Calendar, trend: "Next: Today 2:00 PM", color: "primary" as const },
    { title: "Active Medications", value: "5", icon: Pill, trend: "2 due today", color: "secondary" as const },
    { title: "Patients", value: "2", icon: Users, trend: "Active care plans", color: "success" as const },
    { title: "Pending Alerts", value: "2", icon: AlertTriangle, trend: "Medication reminders", color: "warning" as const },
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
                  {loading ? (
                    <p className="text-muted-foreground">Loading appointments...</p>
                  ) : appointments.length > 0 ? (
                    appointments.slice(0, 2).map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onViewLocation={handleViewLocation}
                      />
                    ))
                  ) : (
                    <p className="text-muted-foreground">No appointments found</p>
                  )}
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
              {loading ? (
                <p className="text-muted-foreground">Loading appointments...</p>
              ) : appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onViewLocation={handleViewLocation}
                  />
                ))
              ) : (
                <p className="text-muted-foreground">No appointments found</p>
              )}
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
                    lat: apt.latitude,
                    lng: apt.longitude,
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
      <DashboardHeader onVoiceAssistantToggle={() => setIsVoiceAssistantOpen(!isVoiceAssistantOpen)} />
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
      
      <VoiceAssistant 
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
      />
    </div>
  );
};

export default Dashboard;