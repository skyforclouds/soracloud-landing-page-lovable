
import { X } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface RequestFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const RequestForm = ({ isOpen, onClose }: RequestFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    jobTitle: "",
    organization: "",
    linkedin: "",
    hearAboutUs: "",
    howCanWeHelp: "",
    consentToMarketing: false,
    interestedInServerless: false,
    interestedInMultimodal: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to your backend
    alert("Form submitted successfully!");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[600px] bg-background border-l border-border z-50 overflow-y-auto"
          >
            <div className="p-6 md:p-10 flex flex-col h-full">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-medium">Request Access</h2>
                <button 
                  onClick={onClose}
                  className="rounded-full p-2 hover:bg-secondary transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto flex-grow">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name<span className="text-accent">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Business email<span className="text-accent">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium mb-2">
                    Job title<span className="text-accent">*</span>
                  </label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium mb-2">
                    Organization<span className="text-accent">*</span>
                  </label>
                  <Input
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium mb-2">
                    LinkedIn
                  </label>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="hearAboutUs" className="block text-sm font-medium mb-2">
                    How did you hear about us?
                  </label>
                  <Input
                    id="hearAboutUs"
                    name="hearAboutUs"
                    value={formData.hearAboutUs}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <p className="block text-sm font-medium mb-2">
                    Which products are you inquiring about?
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="interestedInServerless" 
                        checked={formData.interestedInServerless}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("interestedInServerless", checked as boolean)
                        }
                      />
                      <label 
                        htmlFor="interestedInServerless"
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Serverless Inference
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="interestedInMultimodal" 
                        checked={formData.interestedInMultimodal}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("interestedInMultimodal", checked as boolean)
                        }
                      />
                      <label 
                        htmlFor="interestedInMultimodal"
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Multimodal AI Applications
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="howCanWeHelp" className="block text-sm font-medium mb-2">
                    How can we help?
                  </label>
                  <Textarea
                    id="howCanWeHelp"
                    name="howCanWeHelp"
                    value={formData.howCanWeHelp}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="consentToMarketing" 
                    checked={formData.consentToMarketing}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("consentToMarketing", checked as boolean)
                    }
                  />
                  <label 
                    htmlFor="consentToMarketing"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I consent to receiving email communications and marketing material from Soracloud
                  </label>
                </div>
                
                <div className="pt-6 sticky bottom-0 bg-background pb-6">
                  <Button type="submit" className="w-full font-medium">
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RequestForm;
