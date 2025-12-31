import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Leaf,
  Trophy,
  Zap,
  Car,
  ShoppingBag,
  Target,
  Calendar,
  MapPin,
  Edit,
  Settings,
} from "lucide-react";

const Profile = () => {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH BACKEND DATA ---------------- */
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v4/eco/latest", {
          credentials: "include",
        });
        const data = await res.json();
        setAssessment(data.assessment);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  /* ---------------- LOADING STATE ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f0d] text-white">
        Loading profile...
      </div>
    );
  }

  /* ---------------- UNAUTHORIZED / NO DATA ---------------- */
  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f0d] text-red-400">
        Unauthorized or no assessment found
      </div>
    );
  }

  /* ---------------- DYNAMIC PROFILE DATA ---------------- */
  const userProfile = {
    name: assessment.userId?.name || "User",
    email: assessment.userId?.email,
    avatar: assessment.userId?.profile?.profilePhoto,
    pollutionScore: assessment.score || 0,
    maxScore: 900,
    location: "India",
    joinedDate: "2024",
    rank: 4,
    streakDays: 12,
  };

  const scoreBreakdown = [
    { category: "Electricity", score: 180, maxScore: 225, icon: Zap, color: "#F59E0B" },
    { category: "Transport", score: 210, maxScore: 225, icon: Car, color: "#3B82F6" },
    { category: "Shopping", score: 160, maxScore: 225, icon: ShoppingBag, color: "#14B8A6" },
    { category: "Lifestyle", score: 170, maxScore: 225, icon: Leaf, color: "#22C55E" },
  ];

  /* ---------------- UI ---------------- */
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0f0d" }}>
      <Navbar />

      <main style={{ padding: "6rem 1rem", maxWidth: "1200px", margin: "0 auto" }}>
        {/* PROFILE HEADER */}
        <Card
          style={{
            background: "rgba(20,30,25,0.7)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: "16px",
            marginBottom: "24px",
          }}
        >
          <CardContent style={{ textAlign: "center", padding: "32px" }}>
            <Avatar
              style={{
                width: "120px",
                height: "120px",
                margin: "0 auto",
                border: "4px solid #0a0f0d",
              }}
            >
              <AvatarImage src={userProfile.avatar} />
              <AvatarFallback style={{ fontSize: "2rem", color: "#22C55E" }}>
                {userProfile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <h1 style={{ color: "#E5E7EB", fontSize: "1.5rem", marginTop: "12px" }}>
              {userProfile.name}
            </h1>

            <div style={{ color: "#9CA3AF", marginTop: "4px" }}>
              <MapPin size={14} /> {userProfile.location} •{" "}
              <Calendar size={14} /> Joined {userProfile.joinedDate}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                marginTop: "12px",
              }}
            >
              <Badge style={{ background: "rgba(34,197,94,0.2)", color: "#22C55E" }}>
                <Trophy size={12} /> Rank #{userProfile.rank}
              </Badge>

              <Badge style={{ background: "rgba(245,158,11,0.2)", color: "#F59E0B" }}>
                <Zap size={12} /> {userProfile.streakDays} Day Streak
              </Badge>
            </div>

            <div
              style={{
                marginTop: "16px",
                display: "flex",
                gap: "8px",
                justifyContent: "center",
              }}
            >
              <Button size="sm" variant="outline">
                <Edit size={14} /> Edit
              </Button>
              <Button size="sm" variant="ghost">
                <Settings size={14} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* POLLUTION SCORE */}
        <Card
          style={{
            background: "rgba(20,30,25,0.7)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: "16px",
            marginBottom: "24px",
          }}
        >
          <CardHeader>
            <CardTitle style={{ color: "#E5E7EB" }}>
              <Leaf color="#22C55E" /> Pollution Score
            </CardTitle>
          </CardHeader>

          <CardContent style={{ textAlign: "center" }}>
            <h2
              style={{
                fontSize: "3rem",
                background: "linear-gradient(135deg,#22C55E,#14B8A6,#3B82F6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {userProfile.pollutionScore}
            </h2>
            <p style={{ color: "#9CA3AF" }}>/ {userProfile.maxScore}</p>
          </CardContent>
        </Card>

        {/* SCORE BREAKDOWN */}
        <Card
          style={{
            background: "rgba(20,30,25,0.7)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: "16px",
          }}
        >
          <CardHeader>
            <CardTitle style={{ color: "#E5E7EB" }}>
              <Target color="#14B8A6" /> Score Breakdown
            </CardTitle>
          </CardHeader>

          <CardContent style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {scoreBreakdown.map((item) => (
              <div key={item.category}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#E5E7EB" }}>
                  <span>
                    <item.icon size={14} color={item.color} /> {item.category}
                  </span>
                  <span>{item.score}/{item.maxScore}</span>
                </div>

                <div style={{ height: "8px", background: "#1F2937", borderRadius: "4px" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${(item.score / item.maxScore) * 100}%`,
                      background: item.color,
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
