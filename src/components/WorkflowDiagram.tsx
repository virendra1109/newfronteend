import { useState, useEffect } from 'react';
import { Zap, Database, Search, CheckCircle, Server, Brain, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const WorkflowDiagram = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedServers, setSelectedServers] = useState<number[]>([]);

  // MCP Servers configuration with better dark theme colors
  const mcpServers = [
    { name: 'Slack', color: 'from-purple-500 to-pink-500', icon: '💬', bgColor: 'bg-purple-600' },
    { name: 'HubSpot', color: 'from-orange-500 to-red-500', icon: '🎯', bgColor: 'bg-orange-600' },
    { name: 'Microsoft', color: 'from-blue-500 to-cyan-500', icon: '📘', bgColor: 'bg-blue-600' },
    { name: 'Zomato', color: 'from-red-500 to-pink-500', icon: '🍽️', bgColor: 'bg-red-600' },
    { name: 'Neon', color: 'from-green-500 to-emerald-500', icon: '⚡', bgColor: 'bg-green-600' }
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
    <div className="bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 rounded-2xl p-8 border border-border">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in">
          <h2 className="text-3xl font-bold text-white">
            Agent Workflow Process
          </h2>
          <p className="text-slate-400">
            How Multi-MCP Agent intelligently orchestrates your requests
          </p>
        </div>

        {/* Main Workflow Steps */}
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-16 left-0 right-0 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-out"
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
                  "bg-slate-900 p-5 rounded-2xl shadow-lg border-2 transition-all duration-500",
                  activeStep === index 
                    ? 'border-primary shadow-glow shadow-purple-500/50' 
                    : activeStep > index 
                      ? 'border-green-500/50' 
                      : 'border-slate-800'
                )}>
                  {/* Icon Circle */}
                  <div className={cn(
                    "w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center transition-all duration-500",
                    activeStep === index 
                      ? `bg-gradient-to-br ${step.color} animate-pulse shadow-lg` 
                      : activeStep > index
                        ? 'bg-green-500/20'
                        : 'bg-slate-800'
                  )}>
                    <div className={cn(
                      "transition-colors",
                      activeStep >= index ? 'text-white' : 'text-slate-500'
                    )}>
                      {step.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-1">
                    <div className="text-xs font-semibold text-slate-500">
                      Step {step.id}
                    </div>
                    <h3 className="text-sm font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {step.desc}
                    </p>
                  </div>

                  {/* Checkmark for completed steps */}
                  {activeStep > index && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Active indicator */}
                  {activeStep === index && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Detail */}
        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              {steps[activeStep].icon}
            </div>
            <div>
              <h3 className="font-bold text-white">{steps[activeStep].title}</h3>
              <p className="text-sm text-slate-400">{steps[activeStep].detail}</p>
            </div>
          </div>
        </div>

        {/* MCP Servers Display */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Server className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold text-white">
                Connected MCP Servers
              </h3>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className={cn(
                "w-2 h-2 rounded-full",
                activeStep === 2 || activeStep === 3 ? 'bg-green-500 animate-pulse' : 'bg-slate-600'
              )} />
              <span className="text-slate-400">
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
                    "p-4 rounded-xl border-2 transition-all duration-500 bg-slate-950",
                    isSelected 
                      ? 'border-purple-500 shadow-glow shadow-purple-500/50 bg-gradient-to-br from-purple-900/20 to-pink-900/20' 
                      : 'border-slate-800 hover:border-purple-500/30'
                  )}>
                    {/* Server Icon */}
                    <div className="text-4xl mb-2 text-center">
                      {server.icon}
                    </div>
                    
                    {/* Server Name */}
                    <h4 className="text-sm font-bold text-white text-center mb-2">
                      {server.name}
                    </h4>
                    
                    {/* Status */}
                    <div className="flex items-center justify-center gap-2">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        isSelected ? 'bg-green-500 animate-pulse' : 'bg-slate-600'
                      )} />
                      <span className="text-xs text-slate-400">
                        {isSelected ? 'Active' : 'Ready'}
                      </span>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute -top-2 -right-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-scale-in">
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
            "bg-gradient-to-br from-indigo-950 to-purple-950 rounded-2xl p-6 border-2 transition-all duration-500",
            activeStep === 2 ? 'border-purple-500 shadow-glow shadow-purple-500/50 scale-105' : 'border-slate-800'
          )}>
            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                activeStep === 2 ? 'bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse' : 'bg-purple-900/20'
              )}>
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">FAISS DB</h4>
                <p className="text-sm text-slate-400">Server Indexes</p>
              </div>
            </div>
            <div className="space-y-2">
              {mcpServers.map((server, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-900/50 p-2 rounded-lg">
                  <span className="text-sm text-slate-300">{server.name} Index</span>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    activeStep === 2 && selectedServers.includes(idx) ? 'bg-green-500 animate-pulse' : 'bg-slate-700'
                  )} />
                </div>
              ))}
            </div>
          </div>

          {/* FAISS Tool Indexes */}
          <div className={cn(
            "bg-gradient-to-br from-emerald-950 to-teal-950 rounded-2xl p-6 border-2 transition-all duration-500",
            activeStep === 3 ? 'border-emerald-500 shadow-glow shadow-emerald-500/50 scale-105' : 'border-slate-800'
          )}>
            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                activeStep === 3 ? 'bg-gradient-to-br from-emerald-500 to-teal-500 animate-pulse' : 'bg-emerald-900/20'
              )}>
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Tool Indexes</h4>
                <p className="text-sm text-slate-400">FAISS Search</p>
              </div>
            </div>
            <div className="space-y-2">
              {mcpServers.map((server, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-900/50 p-2 rounded-lg">
                  <span className="text-sm text-slate-300">{server.name} Tools</span>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    activeStep === 3 && selectedServers.includes(idx) ? 'bg-yellow-500 animate-pulse' : 'bg-slate-700'
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
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500 shadow-glow shadow-purple-500/50 scale-110' 
              : 'bg-slate-900 border-slate-800'
          )}>
            <Brain className={cn(
              "w-5 h-5",
              (activeStep === 1 || activeStep === 4) ? 'text-white animate-pulse' : 'text-purple-400'
            )} />
            <span className={cn(
              "font-semibold",
              (activeStep === 1 || activeStep === 4) ? 'text-white' : 'text-slate-300'
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