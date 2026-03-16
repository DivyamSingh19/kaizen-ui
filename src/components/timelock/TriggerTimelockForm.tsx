"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerDescription } from "@/components/ui/drawer"
import { ShieldAlertIcon, Loader2Icon, HexagonIcon } from "lucide-react"
import { toast } from "sonner"
import { triggerTimelock } from "@/functions/api/timelock"

export function TriggerTimelockForm() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [target, setTarget] = useState("")
  const [callData, setCallData] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!target || !callData) {
      toast.error("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      await triggerTimelock(target, callData)
      toast.success("Timelock triggered successfully")
      setOpen(false)
      setTarget("")
      setCallData("")
    } catch (error: any) {
      toast.error(error.message || "Failed to trigger timelock")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-black uppercase tracking-widest text-[11px] px-8 py-6 rounded-2xl shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all">
          <ShieldAlertIcon className="size-4 mr-2" />
          Trigger Lock
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-zinc-950 border-white/5 p-4 max-w-2xl mx-auto">
        <DrawerHeader className="text-left px-0">
          <DrawerTitle className="text-xl font-black uppercase tracking-tight text-white">Trigger New Timelock</DrawerTitle>
          <DrawerDescription className="text-zinc-500 text-xs font-mono">
            Queue a new contract action with a mandatory delay.
          </DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="target" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Target Contract Address</Label>
            <Input
              id="target"
              placeholder="0x..."
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="bg-white/5 border-white/10 rounded-xl h-12 font-mono text-sm focus:ring-emerald-500/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="calldata" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Hex Call Data</Label>
            <div className="relative">
              <textarea
                id="calldata"
                placeholder="0x..."
                value={callData}
                onChange={(e) => setCallData(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl min-h-[120px] p-4 font-mono text-sm focus:ring-1 focus:ring-emerald-500/20 focus:outline-none placeholder:text-zinc-700 transition-all"
              />
              <div className="absolute right-3 bottom-3 opacity-20 pointer-events-none">
                <HexagonIcon className="size-8" />
              </div>
            </div>
          </div>

          <DrawerFooter className="px-0 pt-4 flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 bg-white/5 border-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest py-6 rounded-2xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-white text-black hover:bg-zinc-200 text-xs font-black uppercase tracking-widest py-6 rounded-2xl shadow-xl shadow-white/5"
            >
              {loading ? <Loader2Icon className="size-4 animate-spin" /> : "Initiate Delay"}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
