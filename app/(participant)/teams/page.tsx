"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CalendarClock, AlertTriangle } from "lucide-react";

type EventOption = {
  id: string;
  name: string;
  type: "SOLO" | "TEAM";
  category: string;
  isActive: boolean;
};

type Team = {
  id: string;
  name: string;
  event: {
    id: string;
    name: string;
    type: "SOLO" | "TEAM";
    category: string;
  };
  leader: {
    id: string;
    name: string;
    email: string;
  };
  members: Array<{
    id: string;
    user: { id: string; name: string; email: string };
  }>;
  myRole: "LEADER" | "MEMBER";
};

type TeamsResponse = {
  success: boolean;
  data?: { items: Team[] };
  error?: { message?: string };
};

type EventsResponse = {
  success: boolean;
  data?: { items: EventOption[] };
  error?: { message?: string };
};

export default function TeamsPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [events, setEvents] = useState<EventOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [teamName, setTeamName] = useState<string>("");
  const [eventId, setEventId] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // Team edit config
  const [editConfig, setEditConfig] = useState<{ allowed: boolean; deadline: string | null; reason: string | null } | null>(null);


  const teamEvents = useMemo(() => {
    const filteredEvents = events.filter((event) => event.type === "TEAM" && event.isActive);
    const uniqueEventsMap = new Map();
    
    filteredEvents.forEach(event => {
      const key = `${event.name}-${event.category}`;
      if (!uniqueEventsMap.has(key)) {
        uniqueEventsMap.set(key, event);
      }
    });
    
    return Array.from(uniqueEventsMap.values());
  }, [events]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [teamsRes, eventsRes, editConfigRes] = await Promise.all([
        fetch("/api/teams"),
        fetch("/api/events"),
        fetch("/api/team-edit-config"),
      ]);

      const teamsData: TeamsResponse = await teamsRes.json();
      const eventsData: EventsResponse = await eventsRes.json();

      if (editConfigRes.ok) {
        const ecData = await editConfigRes.json();
        setEditConfig(ecData.data);
      }

      if (!teamsRes.ok || !eventsRes.ok) {
        const errorMessage =
          teamsData.error?.message ||
          eventsData.error?.message ||
          "Unable to load teams.";
        if (teamsRes.status === 401 || eventsRes.status === 401) {
          toast.error("Please sign in to continue.");
          router.push("/auth/signin");
          return;
        }
        toast.error(errorMessage);
        return;
      }

      setTeams(teamsData.data?.items ?? []);
      setEvents(eventsData.data?.items ?? []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load teams.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTeam = async () => {
    if (!teamName.trim() || !eventId) {
      toast.error("Team name and event are required.");
      return;
    }

    setIsCreating(true);
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: teamName.trim(), eventId }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409 && data.error?.data?.suggestions) {
          setSuggestions(data.error.data.suggestions);
          toast.error(data.error.message || "Team name already taken.");
        } else {
          toast.error(data.error?.message || "Failed to create team.");
        }
        return;
      }

      toast.success("Team created successfully.");
      setTeamName("");
      setEventId("");
      setSuggestions([]);
      loadData();
    } catch (error) {
      console.error(error);
      toast.error("Unable to create team.");
    } finally {
      setIsCreating(false);
    }
  };


  return (
    <div className="min-h-screen bg-gat-off-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-gat-steel">
            Teams
          </p>
          <h1 className="text-3xl md:text-4xl font-heading font-black text-gat-midnight">
            Manage Teams
          </h1>
        </div>

        {/* Editing deadline notice */}
        {editConfig && editConfig.deadline && (
          <div className={`mb-6 flex items-start gap-3 p-4 rounded-xl border ${
            editConfig.allowed
              ? "border-blue-200 bg-blue-50"
              : "border-amber-200 bg-amber-50"
          }`}>
            {editConfig.allowed
              ? <CalendarClock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              : <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            }
            <div>
              {editConfig.allowed ? (
                <>
                  <p className="text-sm font-bold text-blue-800">Team member editing is open</p>
                  <p className="text-xs text-blue-700 mt-0.5">
                    Last date to add or remove team members after payment:{" "}
                    <strong>
                      {new Date(editConfig.deadline).toLocaleString("en-IN", {
                        dateStyle: "long",
                        timeStyle: "short",
                        timeZone: "Asia/Kolkata",
                      })} IST
                    </strong>
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-bold text-amber-800">Team member editing is closed</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    {editConfig.reason ?? "The deadline to edit team members has passed."}
                    {" "}
                    The deadline was{" "}
                    <strong>
                      {new Date(editConfig.deadline).toLocaleString("en-IN", {
                        dateStyle: "long",
                        timeStyle: "short",
                        timeZone: "Asia/Kolkata",
                      })} IST
                    </strong>.
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        <div className="bg-white border border-gat-blue/10 rounded-xl p-5 shadow-sm mb-8">
          <h2 className="text-lg font-heading font-bold text-gat-midnight mb-4">
            Create a Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_auto] gap-4">
            <Input
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
              placeholder="Team name"
            />
            <select
              value={eventId}
              onChange={(event) => setEventId(event.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Select team event</option>
              {teamEvents.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name} • {event.category}
                </option>
              ))}
            </select>
            <Button onClick={handleCreateTeam} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </div>

          {suggestions.length > 0 && (
            <div className="mt-4 p-4 bg-gat-blue/5 border border-gat-blue/10 rounded-lg max-w-2xl">
              <p className="text-sm font-bold text-gat-blue uppercase tracking-wider mb-2 flex items-center gap-1.5">
                Suggested Names
              </p>
              <div className="flex flex-wrap gap-2 text-sm">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setTeamName(suggestion);
                      setSuggestions([]);
                    }}
                    className="bg-white border border-gat-blue/20 px-3 py-1.5 rounded-full hover:border-gat-blue hover:text-gat-blue transition-colors shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>


        {loading ? (
          <div className="rounded-xl bg-white p-6 border border-gat-blue/10 shadow-sm">
            Loading teams...
          </div>
        ) : teams.length === 0 ? (
          <div className="rounded-xl bg-white p-10 border border-gat-blue/10 text-center">
            <p className="text-gat-steel">No teams yet. Create one above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {teams.map((team) => (
              <div
                key={team.id}
                className="bg-white border border-gat-blue/10 rounded-xl p-5 shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="text-lg font-heading font-bold text-gat-midnight">
                      {team.name}
                    </p>
                    <p className="text-sm text-gat-steel">
                      {team.event.name} • {team.event.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-gat-blue bg-gat-blue/10 px-3 py-1 rounded-full">
                      {team.myRole}
                    </span>
                    {team.myRole === "LEADER" && (
                      <Link href={`/teams/${team.id}/manage`}>
                        <Button
                          variant="outline"
                          className="text-xs h-8 px-3"
                        >
                          Manage
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
                <div className="mt-4 text-sm text-gat-steel">
                  Leader: {team.leader.name} ({team.leader.email})
                </div>
                <div className="mt-3 text-sm text-gat-steel">
                  Members: {team.members.length}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
