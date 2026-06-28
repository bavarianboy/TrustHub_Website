import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent Successfully",
        description: "An advisor will contact you shortly.",
      });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="w-full pt-24 pb-24">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6" data-testid="text-contact-title">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Reach out to our executive team to discuss how Trust Hub can support your business objectives in Saudi Arabia.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Contact Information */}
          <div className="lg:w-1/3 space-y-10">
            <div>
              <h3 className="text-2xl font-serif font-bold text-foreground mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Head Office</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      King Fahd Road, Olaya District<br />
                      P.O. Box 12345<br />
                      Riyadh, Saudi Arabia
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Phone</h4>
                    <p className="text-muted-foreground text-sm">
                      +966 11 234 5678<br />
                      +966 50 123 4567
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Email</h4>
                    <p className="text-muted-foreground text-sm">
                      info@trusthub.com.sa<br />
                      support@trusthub.com.sa
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Business Hours</h4>
                    <p className="text-muted-foreground text-sm">
                      Sunday - Thursday<br />
                      8:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-foreground text-white rounded-sm">
              <h4 className="font-serif font-bold text-xl mb-4">Dedicated Support</h4>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                Existing clients have access to our 24/7 dedicated support line. Please refer to your client portal for the emergency contact number.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:w-2/3">
            <div className="bg-background border border-border rounded-sm shadow-xl p-8 md:p-12">
              <h3 className="text-2xl font-serif font-bold text-foreground mb-8">Send us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</label>
                    <Input id="name" required placeholder="John Doe" className="bg-secondary/50 focus-visible:ring-primary" data-testid="input-contact-name" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium text-foreground">Company Name</label>
                    <Input id="company" placeholder="Acme Corp" className="bg-secondary/50 focus-visible:ring-primary" data-testid="input-contact-company" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</label>
                    <Input id="email" type="email" required placeholder="john@example.com" className="bg-secondary/50 focus-visible:ring-primary" data-testid="input-contact-email" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</label>
                    <Input id="phone" type="tel" placeholder="+966 5X XXX XXXX" className="bg-secondary/50 focus-visible:ring-primary" data-testid="input-contact-phone" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="service" className="text-sm font-medium text-foreground">Service of Interest</label>
                  <Select name="service" required>
                    <SelectTrigger className="bg-secondary/50 focus:ring-primary" data-testid="select-contact-service">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="setup">Business Setup & Licensing</SelectItem>
                      <SelectItem value="pro">PRO Services</SelectItem>
                      <SelectItem value="hr">HR & Payroll Solutions</SelectItem>
                      <SelectItem value="tax">Accounting & Tax Compliance</SelectItem>
                      <SelectItem value="consultancy">Business Consultancy</SelectItem>
                      <SelectItem value="other">Other / General Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">Your Message</label>
                  <Textarea 
                    id="message" 
                    required 
                    placeholder="How can we help you?" 
                    className="min-h-[150px] bg-secondary/50 focus-visible:ring-primary resize-none"
                    data-testid="input-contact-message"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-semibold"
                  disabled={isSubmitting}
                  data-testid="button-contact-submit"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">Processing...</span>
                  ) : (
                    <span className="flex items-center gap-2">Send Message <Send className="w-4 h-4" /></span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
