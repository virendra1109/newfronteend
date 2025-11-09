// import { useState, useEffect } from "react";
// import { Server, Loader2 } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "sonner";
// import { apiClient, ServerInfo } from "@/lib/api";
// import { ServerCard } from "@/components/ServerCard";

// export default function Servers() {
//   const [servers, setServers] = useState<ServerInfo[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchServers = async () => {
//     try {
//       const response = await apiClient.listServers();
//       const serverList = Object.values(response.details);
//       setServers(serverList);
//     } catch (error: any) {
//       toast.error("Failed to fetch servers", {
//         description: error.message,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchServers();
//     const interval = setInterval(fetchServers, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="container max-w-7xl mx-auto px-4 py-8">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
//               <Server className="h-8 w-8 text-primary" />
//               MCP Server Registry
//             </h1>
//             <p className="text-muted-foreground">
//               Manage your Model Context Protocol servers
//             </p>
//           </div>
//           <Badge variant="secondary" className="px-4 py-2">
//             {servers.length} {servers.length === 1 ? "Server" : "Servers"}
//           </Badge>
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading && (
//         <div className="flex items-center justify-center py-20">
//           <Loader2 className="h-8 w-8 animate-spin text-primary" />
//         </div>
//       )}

//       {/* Empty State */}
//       {!loading && servers.length === 0 && (
//         <div className="text-center py-20">
//           <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
//             <Server className="h-10 w-10 text-white" />
//           </div>
//           <h2 className="text-xl font-semibold mb-2">No servers yet</h2>
//           <p className="text-muted-foreground">
//             MCP servers are loaded from backend configuration
//           </p>
//         </div>
//       )}

//       {/* Server Grid */}
//       {!loading && servers.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
//           {servers.map((server) => (
//             <ServerCard key={server.name} server={server} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Server, Loader2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { apiClient, ServerInfo, MCPServerConfig } from "@/lib/api";
import { ServerCard } from "@/components/ServerCard";
import AddServerModal from "@/components/AddServerModal";
import WorkflowDiagram from "@/components/WorkflowDiagram";

export default function Servers() {
  const [servers, setServers] = useState<ServerInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServers = async () => {
    try {
      const response = await apiClient.listServers();
      const serverList = Object.values(response.details);
      setServers(serverList);
    } catch (error: any) {
      toast.error("Failed to fetch servers", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
    const interval = setInterval(fetchServers, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAddServer = async (config: MCPServerConfig) => {
    try {
      await apiClient.addServer(config);
      toast.success("Server added successfully!", {
        description: `${config.name} is now available`,
      });
      await fetchServers();
    } catch (error: any) {
      toast.error("Failed to add server", {
        description: error.message,
      });
      throw error;
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
              <Server className="h-8 w-8 text-primary" />
              MCP Server Registry
            </h1>
            <p className="text-muted-foreground">
              Manage your Model Context Protocol servers and view the workflow
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="px-4 py-2">
              {servers.length} {servers.length === 1 ? "Server" : "Servers"}
            </Badge>
            <AddServerModal onAdd={handleAddServer} />
          </div>
        </div>
      </div>

      {/* Tabs for Servers and Workflow */}
      <Tabs defaultValue="servers" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="servers" className="gap-2">
            <Server className="h-4 w-4" />
            Servers
          </TabsTrigger>
          <TabsTrigger value="workflow" className="gap-2">
            <Zap className="h-4 w-4" />
            Workflow
          </TabsTrigger>
        </TabsList>

        {/* Servers Tab */}
        <TabsContent value="servers" className="space-y-6">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Empty State */}
          {!loading && servers.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                <Server className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No servers yet</h2>
              <p className="text-muted-foreground mb-4">
                Add your first MCP server to get started
              </p>
              <AddServerModal onAdd={handleAddServer} />
            </div>
          )}

          {/* Server Grid */}
          {!loading && servers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {servers.map((server) => (
                <ServerCard key={server.name} server={server} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Workflow Tab */}
        <TabsContent value="workflow">
          <WorkflowDiagram />
        </TabsContent>
      </Tabs>
    </div>
  );
}