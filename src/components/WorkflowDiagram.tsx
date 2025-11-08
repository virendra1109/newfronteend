import { useState, useEffect } from 'react';
import { Zap, Database, Search, CheckCircle, Server, Brain, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const WorkflowDiagram = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedServers, setSelectedServers] = useState<number[]>([]);

  // MCP Servers configuration
  const mcpServers = [
    { name: 'Slack', color: 'from-purple-500 to-pink-500', icon: '💬', bgColor: 'bg-purple-500' },
    { name: 'HubSpot', color: 'from-orange-500 to-red-500', icon: '🎯', bgColor: 'bg-orange-500' },
    { name: 'Microsoft', color: 'from-blue-500 to-cyan-500', icon: '📘', bgColor: 'bg-blue-500' },
    { name: 'Zomato', color: 'from-red-500 to-pink-500', icon: '🍽️', bgColor: 'bg-red-500' },
    { name: 'Neon', color: 'from-green-500 to-emerald-500', icon: '⚡', bgColor: 'bg-green-500' }
  ];

  const steps = [
    { 
      id: 1, 
      title: 'User Query', 
      desc: 'Natural language input',
      icon: <Sparkles className="w-5 h-5" />,
      color: 'from-purple-400 to-pink-400',
      detail: 'User submits a query in natural language'
    },
    { 
      id: 2, 
      title: 'Orchestrator Agent', 
      desc: 'Azure OpenAI analysis',
      icon: <Brain className="w-5 h-5" />,
      color: 'from-blue-400 to-cyan-400',
      detail: 'AI analyzes query and creates execution plan'
    },
    { 
      id: 3, 
      title: 'Server Selection', 
      desc: 'FAISS semantic search',
      icon: <Database className="w-5 h-5" />,
      color: 'from-indigo-400 to-purple-400',
      detail: 'Searches FAISS indexes to find relevant servers'
    },
    { 
      id: 4, 
      title: 'Tool Discovery', 
      desc: 'Query embedding match',
      icon: <Search className="w-5 h-5" />,
      color: 'from-emerald-400 to-teal-400',
      detail: 'Finds best matching tools from selected servers'
    },
    { 
      id: 5, 
      title: 'Execution', 
      desc: 'Tools run & return results',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'from-green-400 to-emerald-400',
      detail: 'Executes tools and returns formatted results'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        const next = (prev + 1) % steps.length;
        
        // Select random servers when reaching step 3 (Server Selection)
        if (next === 2) {
          const numServers = Math.floor(Math.random() * 2) + 2; // 2-3 servers
          const selected: number[] = [];
          while (selected.length < numServers) {
            const randomIdx = Math.floor(Math.random() * mcpServers.length);
            if (!selected.includes(randomIdx)) {
              selected.push(randomIdx);
            }
          }
          setSelectedServers(selected);
        }
        
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in">
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Agent Workflow Process
          </h2>
          <p className="text-muted-foreground">
            How Multi-MCP Agent intelligently orchestrates your requests
          </p>
        </div>

        {/* Main Workflow Steps */}
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-16 left-0 right-0 h-1 bg-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-primary transition-all duration-1000 ease-out"
              style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-5 gap-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "relative transition-all duration-500",
                  activeStep === index ? 'scale-110 z-10' : 'scale-100 opacity-70'
                )}
              >
                {/* Step Card */}
                <div className={cn(
                  "bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-lg border-2 transition-all duration-500",
                  activeStep === index 
                    ? 'border-primary shadow-glow' 
                    : activeStep > index 
                      ? 'border-success/50' 
                      : 'border-border'
                )}>
                  {/* Icon Circle */}
                  <div className={cn(
                    "w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center transition-all duration-500",
                    activeStep === index 
                      ? `bg-gradient-to-br ${step.color} animate-pulse shadow-lg` 
                      : activeStep > index
                        ? 'bg-success/20'
                        : 'bg-muted'
                  )}>
                    <div className={cn(
                      "transition-colors",
                      activeStep >= index ? 'text-white' : 'text-muted-foreground'
                    )}>
                      {step.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-1">
                    <div className="text-xs font-semibold text-muted-foreground">
                      Step {step.id}
                    </div>
                    <h3 className="text-sm font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {step.desc}
                    </p>
                  </div>

                  {/* Checkmark for completed steps */}
                  {activeStep > index && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Active indicator */}
                  {activeStep === index && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Detail */}
        <div className="bg-gradient-primary/10 backdrop-blur-sm rounded-2xl p-6 border border-primary/20 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              {steps[activeStep].icon}
            </div>
            <div>
              <h3 className="font-bold text-foreground">{steps[activeStep].title}</h3>
              <p className="text-sm text-muted-foreground">{steps[activeStep].detail}</p>
            </div>
          </div>
        </div>

        {/* MCP Servers Display */}
        <div className="bg-card rounded-2xl p-6 border shadow-elegant">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Server className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-foreground">
                Connected MCP Servers
              </h3>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className={cn(
                "w-2 h-2 rounded-full",
                activeStep === 2 || activeStep === 3 ? 'bg-success animate-pulse' : 'bg-muted-foreground'
              )} />
              <span className="text-muted-foreground">
                {activeStep === 2 || activeStep === 3 ? 'Searching...' : 'Ready'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4">
            {mcpServers.map((server, index) => {
              const isSelected = selectedServers.includes(index) && (activeStep === 2 || activeStep === 3);
              
              return (
                <div
                  key={server.name}
                  className={cn(
                    "relative group transition-all duration-500 transform",
                    isSelected ? 'scale-110 z-10' : 'scale-100'
                  )}
                >
                  <div className={cn(
                    "p-4 rounded-xl border-2 transition-all duration-500",
                    isSelected 
                      ? 'border-primary shadow-glow bg-gradient-to-br from-primary/5 to-primary/10' 
                      : 'border-border bg-card hover:border-primary/30'
                  )}>
                    {/* Server Icon */}
                    <div className="text-4xl mb-2 text-center">
                      {server.icon}
                    </div>
                    
                    {/* Server Name */}
                    <h4 className="text-sm font-bold text-foreground text-center mb-2">
                      {server.name}
                    </h4>
                    
                    {/* Status */}
                    <div className="flex items-center justify-center gap-2">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        isSelected ? 'bg-success animate-pulse' : 'bg-muted-foreground'
                      )} />
                      <span className="text-xs text-muted-foreground">
                        {isSelected ? 'Active' : 'Ready'}
                      </span>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute -top-2 -right-2">
                        <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Database Layers */}
        <div className="grid grid-cols-2 gap-6">
          {/* FAISS Server Indexes */}
          <div className={cn(
            "bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-2xl p-6 border-2 transition-all duration-500",
            activeStep === 2 ? 'border-primary shadow-glow scale-105' : 'border-border'
          )}>
            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                activeStep === 2 ? 'bg-gradient-primary animate-pulse' : 'bg-primary/20'
              )}>
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-foreground">FAISS DB</h4>
                <p className="text-sm text-muted-foreground">Server Indexes</p>
              </div>
            </div>
            <div className="space-y-2">
              {mcpServers.map((server, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/50 dark:bg-slate-800/50 p-2 rounded-lg">
                  <span className="text-sm text-foreground">{server.name} Index</span>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    activeStep === 2 && selectedServers.includes(idx) ? 'bg-success animate-pulse' : 'bg-muted-foreground/30'
                  )} />
                </div>
              ))}
            </div>
          </div>

          {/* FAISS Tool Indexes */}
          <div className={cn(
            "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-2xl p-6 border-2 transition-all duration-500",
            activeStep === 3 ? 'border-primary shadow-glow scale-105' : 'border-border'
          )}>
            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                activeStep === 3 ? 'bg-gradient-primary animate-pulse' : 'bg-primary/20'
              )}>
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-foreground">Tool Indexes</h4>
                <p className="text-sm text-muted-foreground">FAISS Search</p>
              </div>
            </div>
            <div className="space-y-2">
              {mcpServers.map((server, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/50 dark:bg-slate-800/50 p-2 rounded-lg">
                  <span className="text-sm text-foreground">{server.name} Tools</span>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    activeStep === 3 && selectedServers.includes(idx) ? 'bg-warning animate-pulse' : 'bg-muted-foreground/30'
                  )} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Azure OpenAI Badge */}
        <div className="flex justify-center">
          <div className={cn(
            "inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all duration-500",
            (activeStep === 1 || activeStep === 4) 
              ? 'bg-gradient-primary border-primary shadow-glow scale-110' 
              : 'bg-card border-border'
          )}>
            <Brain className={cn(
              "w-5 h-5",
              (activeStep === 1 || activeStep === 4) ? 'text-white animate-pulse' : 'text-primary'
            )} />
            <span className={cn(
              "font-semibold",
              (activeStep === 1 || activeStep === 4) ? 'text-white' : 'text-foreground'
            )}>
              Powered by Azure OpenAI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDiagram;
