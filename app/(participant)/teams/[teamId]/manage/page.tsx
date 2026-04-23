"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Edit2, Check, X, Sparkles } from "lucide-react";

type Member = {
  id: string;
  userId: string;
  role: "LEADER" | "MEMBER";
  joinedAt: string;
  user: { id: string; name: string; email: string; collegeName: string };
};

type TeamInviteRow = {
  id: string;
  invitedUserId: string;
  status: "PENDING" | "REJECTED";
  createdAt: string;
  respondedAt: string | null;
  User_TeamInvite_invitedUserIdToUser: {
    id: string;
    name: string;
    email: string;
  };
};

type TeamDetail = {
  id: string;
  name: string;
  event: {
    id: string;
    name: string;
    type: string;
    category: string;
    price: number;
    minTeamSize: number | null;
    maxTeamSize: number | null;
  };
  leader: { id: string; name: string; email: string };
  members: Member[];
  TeamInvite: TeamInviteRow[];
};

type TeamResponse = {
  success: boolean;
  data?: { team: TeamDetail };
  error?: { message?: string };
};

type ProfileResponse = {
  success: boolean;
  data?: { user: { id: string; name: string; email: string } };
  error?: { message?: string };
};

export default function ManageTeamPage() {
  const router = useRouter();
  const params = useParams<{ teamId: string }>();
  const teamId = params.teamId;

  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  // Renaming state
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [teamRes, profileRes] = await Promise.all([
        fetch(`/api/teams/${teamId}`),
        fetch("/api/profile"),
      ]);

      const teamData: TeamResponse = await teamRes.json();
      const profileData: ProfileResponse = await profileRes.json();

      if (!teamRes.ok) {
        if (teamRes.status === 401) {
          toast.error("Please sign in to continue.");
          router.push("/auth/signin");
          return;
        }
        if (teamRes.status === 403) {
          toast.error("You don't have access to this team.");
          router.push("/teams");
          return;
        }
        toast.error(teamData.error?.message || "Failed to load team.");
        router.push("/teams");
        return;
      }

      if (teamData.data?.team) {
        setTeam(teamData.data.team);
        setNewName(teamData.data.team.name);
      }

      if (profileRes.ok && profileData.data?.user?.id) {
        setCurrentUserId(profileData.data.user.id);
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to load team details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  const handleInvite = async () => {
    if (!email.trim()) {
      toast.error("Please enter an email address.");
      return;
    }

    setInviting(true);
    try {
      const res = await fetch(`/api/teams/${teamId}/invites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error?.message || "Failed to send invite.");
        return;
      }

      toast.success("Invite sent successfully.");
      setEmail("");
      loadData();
    } catch (error) {
      console.error(error);
      toast.error("Unable to send invite.");
    } finally {
      setInviting(false);
    }
  };

  const handleRename = async () => {
    if (!newName.trim()) {
      toast.error("Team name cannot be empty.");
      return;
    }

    if (newName.trim() === team?.name) {
      setIsEditingName(false);
      setSuggestions([]);
      return;
    }

    setRenaming(true);
    try {
      const res = await fetch(`/api/teams/${teamId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409 && data.error?.data?.suggestions) {
          setSuggestions(data.error.data.suggestions);
          toast.error(data.error.message || "Team name already taken.");
        } else {
          toast.error(data.error?.message || "Failed to rename team.");
        }
        return;
      }

      toast.success("Team renamed successfully.");
      setIsEditingName(false);
      setSuggestions([]);
      loadData();
    } catch (error) {
      console.error(error);
      toast.error("Unable to rename team.");
    } finally {
      setRenaming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gat-off-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-white p-6 border border-gat-blue/10 shadow-sm">
            Loading team...
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gat-off-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-white p-10 border border-gat-blue/10 shadow-sm text-center">
            <p className="text-gat-steel">Team not found.</p>
            <Link
              href="/teams"
              className="text-gat-blue text-sm mt-2 inline-block hover:underline"
            >
              ← Back to Teams
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isLeader = currentUserId === team.leader.id;

  return (
    <div className="min-h-screen bg-gat-off-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/teams"
            className="text-xs text-gat-steel hover:text-gat-blue"
          >
            ← Back to Teams
          </Link>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-gat-steel mt-3">
            Team
          </p>
          <div className="flex items-center gap-3 group">
            {isEditingName ? (
              <div className="flex-1 max-w-md">
                <div className="flex gap-2">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename();
                      if (e.key === "Escape") {
                        setIsEditingName(false);
                        setSuggestions([]);
                      }
                    }}
                    placeholder="New team name"
                    className="text-xl font-heading font-bold h-12"
                    autoFocus
                  />
                  <Button
                    size="icon"
                    onClick={handleRename}
                    disabled={renaming}
                    className="h-12 w-12 bg-gat-blue text-white"
                  >
                    <Check className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setIsEditingName(false);
                      setSuggestions([]);
                      setNewName(team.name);
                    }}
                    disabled={renaming}
                    className="h-12 w-12 text-gat-steel"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {suggestions.length > 0 && (
                  <div className="mt-3 p-4 bg-gat-blue/5 border border-gat-blue/10 rounded-lg">
                    <p className="text-xs font-bold text-gat-blue uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3" /> Suggestions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => {
                            setNewName(suggestion);
                            setSuggestions([]);
                          }}
                          className="text-xs bg-white border border-gat-blue/20 px-3 py-1.5 rounded-full hover:border-gat-blue hover:text-gat-blue transition-colors shadow-sm"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl font-heading font-black text-gat-midnight">
                  {team.name}
                </h1>
                {isLeader && (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-2 text-gat-steel hover:text-gat-blue transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Rename Team"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                )}
              </>
            )}
          </div>

          <p className="text-sm text-gat-steel mt-1">
            {team.event.name} • {team.event.category}
          </p>
        </div>

        {/* Members */}
        <div className="bg-white border border-gat-blue/10 rounded-xl p-5 shadow-sm mb-6">
          <h2 className="text-lg font-heading font-bold text-gat-midnight mb-4">
            Members
            {team.event.maxTeamSize !== null && (
              <span className="text-sm font-normal text-gat-steel ml-2">
                ({team.members.length} / {team.event.maxTeamSize})
              </span>
            )}
          </h2>

          {/* Minimum Members Requirement */}
          {team.event.minTeamSize !== null && (
            <div
              className={`mb-4 p-3 rounded-lg border ${
                team.members.length >= team.event.minTeamSize
                  ? "bg-green-50 border-green-200"
                  : "bg-amber-50 border-amber-200"
              }`}
            >
              <p
                className={`text-sm font-semibold ${
                  team.members.length >= team.event.minTeamSize
                    ? "text-green-800"
                    : "text-amber-800"
                }`}
              >
                {team.members.length >= team.event.minTeamSize ? (
                  <>
                    ✓ Minimum members reached ({team.members.length} /{" "}
                    {team.event.minTeamSize})
                  </>
                ) : (
                  <>
                    ⚠ You need at least {team.event.minTeamSize} member(s) to
                    register this team. Currently have {team.members.length}.
                  </>
                )}
              </p>
            </div>
          )}

          <div className="space-y-3">
            {team.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gat-blue/10"
              >
                <div>
                  <p className="text-sm font-medium text-gat-midnight">
                    {member.user.name}
                  </p>
                  <p className="text-xs text-gat-steel">{member.user.email}</p>
                  <p className="text-xs text-gat-steel">
                    {member.user.collegeName}
                  </p>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-gat-blue bg-gat-blue/10 px-3 py-1 rounded-full">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Invite section — leader only */}
        {/* Invite section — leader only */}

        {isLeader && (
          <>
            <div className="bg-white border border-gat-blue/10 rounded-xl p-5 shadow-sm mb-6">
              <h2 className="text-lg font-heading font-bold text-gat-midnight mb-4">
                Invite a Member
              </h2>
              <div className="flex gap-3">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !inviting && handleInvite()
                  }
                  placeholder="Enter registered email address"
                  className="flex-1"
                />
                <Button
                  onClick={handleInvite}
                  disabled={inviting}
                  className="bg-gat-blue text-white hover:bg-gat-midnight"
                >
                  {inviting ? "Sending..." : "Send Invite"}
                </Button>
              </div>
              <p className="text-xs text-gat-steel mt-2">
                The user must already be registered on the platform.
              </p>
            </div>

            {/* Pending & Rejected Invites */}
            <div className="bg-white border border-gat-blue/10 rounded-xl p-5 shadow-sm">
              <h2 className="text-lg font-heading font-bold text-gat-midnight mb-4">
                Sent Invites
              </h2>
              {team.TeamInvite.length === 0 ? (
                <p className="text-sm text-gat-steel">No invites sent yet.</p>
              ) : (
                <div className="space-y-3">
                  {team.TeamInvite.map((invite) => {
                    const isPending = invite.status === "PENDING";
                    return (
                      <div
                        key={invite.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          isPending
                            ? "border-amber-200 bg-amber-50/40"
                            : "border-red-200 bg-red-50/40"
                        }`}
                      >
                        <div>
                          <p className="text-sm font-medium text-gat-midnight">
                            {invite.User_TeamInvite_invitedUserIdToUser.name}
                          </p>
                          <p className="text-xs text-gat-steel">
                            {invite.User_TeamInvite_invitedUserIdToUser.email}
                          </p>
                          {invite.respondedAt && (
                            <p className="text-xs text-gat-steel mt-0.5">
                              Responded:{" "}
                              {new Date(invite.respondedAt).toLocaleDateString(
                                "en-IN",
                                { dateStyle: "medium" },
                              )}
                            </p>
                          )}
                        </div>
                        <span
                          className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                            isPending
                              ? "text-amber-600 bg-amber-100"
                              : "text-red-600 bg-red-100"
                          }`}
                        >
                          {invite.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
