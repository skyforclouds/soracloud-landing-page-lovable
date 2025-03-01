
import { motion } from "framer-motion";
import { Check, Info, Plus, Trash, Eraser } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import RequestForm from "./RequestForm";

// GPU options array
const gpuOptions = [
  { name: "NVIDIA H100 80GB", mghPerHour: 6 },
  { name: "NVIDIA A100 80GB", mghPerHour: 4 },
  { name: "NVIDIA A100 40GB", mghPerHour: 3 },
  { name: "NVIDIA L40S", mghPerHour: 2.5 },
  { name: "NVIDIA A10", mghPerHour: 1 },
  { name: "NVIDIA T4", mghPerHour: 0.5 },
];

// Pricing plan data
const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for individuals and small teams just getting started with AI.",
    quota: "50 MGH Included",
    features: [
      "Serverless Inference",
      "IDE Integrations",
      "API Access",
      "Community Support",
    ],
  },
  {
    name: "Business",
    price: "499",
    description: "For growing teams with serious AI workloads and production needs.",
    quota: "1,500 MGH Included",
    overageRate: "$0.40 per MGH",
    features: [
      "All Starter features",
      "Priority Scheduling",
      "Private Model Hosting",
      "Team Management",
      "24/7 Email Support",
      "99.9% SLA",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations with advanced needs and custom requirements.",
    quota: "Custom MGH Quotas",
    features: [
      "All Business features",
      "Custom Model Deployment",
      "On-Premises Option",
      "Advanced Security",
      "Dedicated Account Manager",
      "Custom SLAs",
    ],
  },
];

const Pricing = ({ showCalculator = true }) => {
  const [selectedGpu, setSelectedGpu] = useState("");
  const [quantity, setQuantity] = useState<number | string>(1);
  const [calculatedItems, setCalculatedItems] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const openForm = () => {
    setIsFormOpen(true);
    // Prevent body scrolling when form is open
    document.body.style.overflow = "hidden";
  };

  const closeForm = () => {
    setIsFormOpen(false);
    // Restore body scrolling when form is closed
    document.body.style.overflow = "auto";
  };

  const addItem = () => {
    if (!selectedGpu || !quantity) return;
    
    const selectedOption = gpuOptions.find(option => option.name === selectedGpu);
    if (!selectedOption) return;
    
    const numQuantity = typeof quantity === 'string' ? parseInt(quantity) : quantity;
    
    // Calculate Monthly MGH (30 days x 24 hours x MGH per hour x quantity)
    const totalMGH = 30 * 24 * selectedOption.mghPerHour * numQuantity;
    
    const newItem = {
      id: Date.now(),
      gpuType: selectedGpu,
      quantity: numQuantity,
      mghPerHour: selectedOption.mghPerHour,
      totalMGH,
    };
    
    setCalculatedItems([...calculatedItems, newItem]);
    
    // Reset form
    setSelectedGpu("");
    setQuantity(1);
  };
  
  const removeItem = (id: number) => {
    setCalculatedItems(calculatedItems.filter(item => item.id !== id));
  };
  
  const clearAllItems = () => {
    setCalculatedItems([]);
  };
  
  // Calculate total MGH
  const totalMGH = calculatedItems.reduce((sum, item) => sum + item.totalMGH, 0);
  
  // Determine recommended plan based on total MGH
  let recommendedPlan = null;
  if (totalMGH > 0) {
    if (totalMGH <= 50) {
      recommendedPlan = plans[0]; // Starter
    } else if (totalMGH <= 1500) {
      recommendedPlan = plans[1]; // Business
    } else {
      recommendedPlan = plans[2]; // Enterprise
    }
  }

  return (
    <>
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-medium mb-6 text-foreground">Simple, Predictable Pricing</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Start with a generous monthly quota of Managed GPU Hours (MGH)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="inline-flex items-center ml-1 text-muted-foreground hover:text-foreground">
                        <Info className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-secondary p-2 shadow-lg rounded-md border border-border max-w-xs text-foreground">
                      <p>Based on type and number of GPUs managed by SoraCloud</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                . Only pay for additional usage beyond your plan's quota.
              </p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`glass-effect rounded-2xl overflow-hidden hover:bg-secondary/40 transition-all ${
                  plan.name === "Business" ? "ring-2 ring-accent scale-105" : ""
                }`}
              >
                <div className="p-8 border-b border-border/50">
                  <h3 className="text-2xl font-medium mb-2 text-foreground">{plan.name}</h3>
                  <div className="flex items-baseline mb-4">
                    {plan.price === "Custom" ? (
                      <span className="text-4xl font-medium text-foreground">Custom</span>
                    ) : plan.price === "Free" ? (
                      <span className="text-4xl font-medium text-foreground">Free</span>
                    ) : (
                      <>
                        <span className="text-4xl font-medium text-foreground">${plan.price}</span>
                        <span className="text-muted-foreground ml-2">/month</span>
                      </>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                  <div className="mt-4 p-2 bg-secondary/70 rounded-lg">
                    <p className="text-sm font-medium text-foreground">
                      {plan.quota}
                      {plan.overageRate && (
                        <>
                          <br />
                          <span className="text-muted-foreground">
                            Then {plan.overageRate}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="p-8 flex flex-col h-full">
                  <ul className="space-y-4 flex-grow">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.name === "Enterprise" ? (
                    <button 
                      onClick={openForm}
                      className="w-full mt-8 px-8 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors text-center font-medium"
                    >
                      Contact Sales
                    </button>
                  ) : (
                    <button 
                      onClick={openForm}
                      className="w-full mt-8 px-8 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors text-center font-medium"
                    >
                      Request Access
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Pricing Calculator Section - only shown when showCalculator is true */}
          {showCalculator && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mt-24 max-w-4xl mx-auto"
            >
              <h2 className="text-3xl font-medium text-center mb-8 text-foreground">Pricing Calculator</h2>
              <p className="text-muted-foreground text-center mb-8">Estimate your monthly GPU usage and find the right plan for your needs.</p>
              
              <div className="glass-effect rounded-2xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label htmlFor="gpu-type" className="block text-sm font-medium text-muted-foreground mb-2">
                      GPU Type
                    </label>
                    <Select value={selectedGpu} onValueChange={setSelectedGpu}>
                      <SelectTrigger id="gpu-type" className="w-full">
                        <SelectValue placeholder="Select GPU" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned" align="center">
                        {gpuOptions.map((gpu) => (
                          <SelectItem key={gpu.name} value={gpu.name}>
                            {gpu.name} ({gpu.mghPerHour} MGH/hr)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-muted-foreground mb-2">
                      Quantity
                    </label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setQuantity('');
                        } else {
                          const numValue = parseInt(value);
                          if (!isNaN(numValue) && numValue > 0) {
                            setQuantity(numValue);
                          }
                        }
                      }}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      onClick={addItem} 
                      className="w-full"
                      disabled={!selectedGpu || (typeof quantity === 'string' && quantity === '') || (typeof quantity === 'number' && quantity < 1)}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add to Estimate
                    </Button>
                  </div>
                </div>
                
                {calculatedItems.length > 0 && (
                  <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-foreground">Your Configuration</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={clearAllItems}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Eraser className="mr-2 h-4 w-4" /> Clear All
                      </Button>
                    </div>
                    
                    <div className="rounded-lg overflow-hidden border border-border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>GPU Type</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>MGH/Hour</TableHead>
                            <TableHead>Monthly MGH</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {calculatedItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.gpuType}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{item.mghPerHour * item.quantity}</TableCell>
                              <TableCell>{item.totalMGH.toLocaleString()}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => removeItem(item.id)}
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="mt-6 p-4 rounded-lg bg-secondary/50 flex flex-col md:flex-row justify-between items-center">
                      <div>
                        <p className="text-lg font-medium text-foreground">
                          Estimated Monthly Usage: <span className="text-accent">{totalMGH.toLocaleString()} MGH</span>
                        </p>
                      </div>
                      
                      {recommendedPlan && (
                        <div className="mt-4 md:mt-0">
                          <p className="text-muted-foreground">
                            Recommended Plan:
                            <span className="ml-2 font-medium text-foreground">
                              {recommendedPlan.name}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <RequestForm isOpen={isFormOpen} onClose={closeForm} />
    </>
  );
};

export default Pricing;
