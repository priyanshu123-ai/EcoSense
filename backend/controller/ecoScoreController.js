import OpenAI from "openai";
import Assessment from "../model/Assessment.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const ecoScoreController = async (req, res) => {
  try {
    const userId = req.userId;
    const { answers } = req.body;

    const prompt = `
You are an environmental pollution expert.

Analyze pollution using PERSONAL and AREA factors.

User data:
${JSON.stringify(answers, null, 2)}

SCORING RULES:
- 0–400  = High Pollution Impact
- 401–700 = Moderate Pollution Impact
- 701–900 = Low Pollution Impact

Return ONLY valid JSON:
{
  "score": number,
  "level": string,
  "explanation": string,
  "precautions": {
    "personal": [string, string, string],
    "area": [string, string, string]
  }
}
`;

    // ✅ FORCE JSON OUTPUT
    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    // ✅ SAFE PARSE
    const result = JSON.parse(aiRes.choices[0].message.content);

    const savedAssessment = await Assessment.create({
      userId,
      answers,
      score: result.score,
      level: result.level,
      aiExplanation: result.explanation,
      precautions: result.precautions,
    });

    const populatedAssessment = await Assessment.findById(
      savedAssessment._id
    ).populate("userId", "name email profile");

    res.json({
      success: true,
      assessment: populatedAssessment,
    });
  } catch (error) {
    console.error("EcoScore Error:", error);
    res.status(500).json({
      success: false,
      message: "Eco analysis failed",
    });
  }
};

export const getLatestAssessment = async (req, res) => {
  try {
    const userId = req.userId;

    const assessment = await Assessment.findOne({ userId })
      .populate("userId", "name email profile")
      .sort({ createdAt: -1 });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "No assessment found",
      });
    }

    res.json({
      success: true,
      assessment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch latest assessment",
    });
  }
};

export const updateEcoAssessment = async (req, res) => {
  try {
    const userId = req.userId;
    const { assessmentId } = req.params;
    const { answers } = req.body;

    // 🔒 Ownership check
    const assessment = await Assessment.findOne({
      _id: assessmentId,
      userId,
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found",
      });
    }

    // 🔹 AI PROMPT
    const prompt = `
You are an environmental pollution expert.

Analyze pollution using PERSONAL and AREA factors.

User data:
${JSON.stringify(answers, null, 2)}

SCORING RULES:
- 0–400  = High Pollution Impact
- 401–700 = Moderate Pollution Impact
- 701–900 = Low Pollution Impact

Return ONLY valid JSON:
{
  "score": number,
  "level": string,
  "explanation": string,
  "precautions": {
    "personal": [string, string, string],
    "area": [string, string, string]
  }
}
`;

    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(aiRes.choices[0].message.content);

    // 🛡 Clamp safety
    const score = Math.max(0, Math.min(900, result.score));

    // ✅ UPDATE DATA
    assessment.answers = answers;
    assessment.score = score;
    assessment.level = result.level;
    assessment.aiExplanation = result.explanation;
    assessment.precautions = result.precautions;

    await assessment.save();

    const populatedAssessment = await Assessment.findById(
      assessment._id
    ).populate("userId", "name email profile");

    res.json({
      success: true,
      assessment: populatedAssessment,
    });
  } catch (error) {
    console.error("Update Assessment Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update assessment",
    });
  }
};


export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Assessment.aggregate([
      // Latest assessment first (per user)
      { $sort: { createdAt: -1 } },

      // Pick latest assessment of each user
      {
        $group: {
          _id: "$userId",
          score: { $first: "$score" },
          level: { $first: "$level" },
          createdAt: { $first: "$createdAt" }
        }
      },

      // ASCENDING order by score (LOW → HIGH)
      { $sort: { score: 1 } },

      // Join user data
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },

      { $unwind: "$user" },

      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          email: "$user.email",
          avatar: "$user.profile.profilePhoto",
          score: 1,
          level: 1
        }
      }
    ]);

    // Rank will now be LOWEST = rank 1
    const ranked = leaderboard.map((u, index) => ({
      rank: index + 1,
      ...u
    }));

    res.status(200).json({
      success: true,
      totalUsers: ranked.length,
      leaderboard: ranked
    });
  } catch (error) {
    console.error("Leaderboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard"
    });
  }
};




