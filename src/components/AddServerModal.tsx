import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MCPServerConfig } from '@/lib/api';

interface AddServerModalProps {
  onAdd: (config: MCPServerConfig) => Promise<void>;
}

export default function AddServerModal({ onAdd }: AddServerModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverType, setServerType] = useState<'command' | 'http'>('command');
  const [name, setName] = useState('');
  const [command, setCommand] = useState('');
  const [args, setArgs] = useState<string[]>(['']);
  const [endpoint, setEndpoint] = useState('');
  const [envVars, setEnvVars] = useState<Array<{ key: string; value: string }>>([
    { key: '', value: '' },
  ]);
  const [description, setDescription] = useState('');

  const handleAddArg = () => {
    setArgs([...args, '']);
  };

  const handleArgChange = (index: number, value: string) => {
    const newArgs = [...args];
    newArgs[index] = value;
    setArgs(newArgs);
  };

  const handleRemoveArg = (index: number) => {
    setArgs(args.filter((_, i) => i !== index));
  };

  const handleAddEnvVar = () => {
    setEnvVars([...envVars, { key: '', value: '' }]);
  };

  const handleEnvVarChange = (index: number, field: 'key' | 'value', value: string) => {
    const newEnvVars = [...envVars];
    newEnvVars[index][field] = value;
    setEnvVars(newEnvVars);
  };

  const handleRemoveEnvVar = (index: number) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config: MCPServerConfig = {
        name,
        type: serverType,
        description: description || undefined,
      };

      if (serverType === 'command') {
        config.command = command;
        config.args = args.filter((arg) => arg.trim() !== '');
      } else {
        config.endpoint = endpoint;
      }

      // Build env object
      const env: Record<string, string> = {};
      envVars.forEach((ev) => {
        if (ev.key.trim() !== '' && ev.value.trim() !== '') {
          env[ev.key] = ev.value;
        }
      });
      if (Object.keys(env).length > 0) {
        config.env = env;
      }

      await onAdd(config);
      
      // Reset form
      setName('');
      setCommand('');
      setArgs(['']);
      setEndpoint('');
      setEnvVars([{ key: '', value: '' }]);
      setDescription('');
      setOpen(false);
    } catch (error) {
      // Error is already handled by parent
      console.error('Failed to add server:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="gradient">
          <Plus className="mr-2 h-5 w-5" />
          Add Server
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New MCP Server</DialogTitle>
          <DialogDescription>
            Configure a new Model Context Protocol server to add to your agent system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Server Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Server Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., slack, github, filesystem"
              required
            />
          </div>

          {/* Server Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Server Type *</Label>
            <Select value={serverType} onValueChange={(v) => setServerType(v as 'command' | 'http')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="command">command (Local Process)</SelectItem>
                <SelectItem value="http">http (Remote Server)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Command Type Fields */}
          {serverType === 'command' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="command">Command *</Label>
                <Input
                  id="command"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="e.g., npx, node, python"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Arguments</Label>
                {args.map((arg, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={arg}
                      onChange={(e) => handleArgChange(index, e.target.value)}
                      placeholder="e.g., -y, @modelcontextprotocol/server-name"
                    />
                    {args.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveArg(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={handleAddArg}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Argument
                </Button>
              </div>
            </>
          )}

          {/* HTTP Type Fields */}
          {serverType === 'http' && (
            <div className="space-y-2">
              <Label htmlFor="endpoint">Server Endpoint *</Label>
              <Input
                id="endpoint"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="https://api.example.com"
                type="url"
                required
              />
            </div>
          )}

          {/* Environment Variables */}
          <div className="space-y-2">
            <Label>Environment Variables</Label>
            {envVars.map((envVar, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={envVar.key}
                  onChange={(e) => handleEnvVarChange(index, 'key', e.target.value)}
                  placeholder="KEY"
                  className="flex-1"
                />
                <Input
                  value={envVar.value}
                  onChange={(e) => handleEnvVarChange(index, 'value', e.target.value)}
                  placeholder="value"
                  className="flex-1"
                  type="password"
                />
                {envVars.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveEnvVar(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={handleAddEnvVar}>
              <Plus className="mr-2 h-4 w-4" />
              Add Environment Variable
            </Button>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this server do?"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            variant="gradient"
            className="w-full"
          >
            {loading ? 'Adding Server...' : 'Add Server'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}