import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CalendarDays, User, Phone, MapPin, Heart, AlertCircle } from "lucide-react";

interface PatientDetails {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  emergencyContact: string;
  address: string;
  bloodType: string;
  allergies: string;
  medicalConditions: string;
  insuranceNumber: string;
  primaryDoctor: string;
  notes: string;
}

const PatientDetailsForm = () => {
  const [patientDetails, setPatientDetails] = useState<PatientDetails>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phone: "",
    emergencyContact: "",
    address: "",
    bloodType: "",
    allergies: "",
    medicalConditions: "",
    insuranceNumber: "",
    primaryDoctor: "",
    notes: ""
  });

  const handleInputChange = (field: keyof PatientDetails, value: string) => {
    setPatientDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log("Saving patient details:", patientDetails);
    // TODO: Save to database
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name</Label>
              <Input
                id="firstName"
                value={patientDetails.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Enter first name"
                className="border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name</Label>
              <Input
                id="lastName"
                value={patientDetails.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Enter last name"
                className="border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-sm font-medium text-foreground flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                Date of Birth
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={patientDetails.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                className="border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-foreground flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                value={patientDetails.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter phone number"
                className="border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContact" className="text-sm font-medium text-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Emergency Contact
            </Label>
            <Input
              id="emergencyContact"
              value={patientDetails.emergencyContact}
              onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
              placeholder="Emergency contact name and phone"
              className="border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Address
            </Label>
            <Textarea
              id="address"
              value={patientDetails.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Enter full address"
              className="border-border"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Medical Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bloodType" className="text-sm font-medium text-foreground">Blood Type</Label>
              <Select value={patientDetails.bloodType} onValueChange={(value) => handleInputChange("bloodType", value)}>
                <SelectTrigger className="border-border">
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryDoctor" className="text-sm font-medium text-foreground">Primary Doctor</Label>
              <Input
                id="primaryDoctor"
                value={patientDetails.primaryDoctor}
                onChange={(e) => handleInputChange("primaryDoctor", e.target.value)}
                placeholder="Dr. Smith"
                className="border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allergies" className="text-sm font-medium text-foreground">Allergies</Label>
            <Textarea
              id="allergies"
              value={patientDetails.allergies}
              onChange={(e) => handleInputChange("allergies", e.target.value)}
              placeholder="List any known allergies (medications, food, environmental)"
              className="border-border"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalConditions" className="text-sm font-medium text-foreground">Medical Conditions</Label>
            <Textarea
              id="medicalConditions"
              value={patientDetails.medicalConditions}
              onChange={(e) => handleInputChange("medicalConditions", e.target.value)}
              placeholder="List current medical conditions"
              className="border-border"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="insuranceNumber" className="text-sm font-medium text-foreground">Insurance Number</Label>
            <Input
              id="insuranceNumber"
              value={patientDetails.insuranceNumber}
              onChange={(e) => handleInputChange("insuranceNumber", e.target.value)}
              placeholder="Insurance policy number"
              className="border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-foreground">Additional Notes</Label>
            <Textarea
              id="notes"
              value={patientDetails.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Any additional medical notes or information"
              className="border-border"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" className="border-border">
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-gradient-primary text-primary-foreground">
          Save Patient Details
        </Button>
      </div>
    </div>
  );
};

export default PatientDetailsForm;