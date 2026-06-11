import Candidate from "./candidate.model.js";
import User from "../users/user.model.js";
import Election from "../elections/election.model.js";
import bcrypt from "bcryptjs";

const createCandidate = async (data) => {

  const {
    electionId,
    email,
    name,
    bio,
    imageCid,
  } = data;

  const election =
    await Election.findById(
      electionId
    );

  if (!election) {
    throw new Error(
      "Election not found"
    );
  }

  const existedCandidate =
    await Candidate.findOne({
      electionId,
      email,
    });

  if (existedCandidate) {
    throw new Error(
      "Candidate already exists"
    );
  }

  let user =
    await User.findOne({
      email,
    });

  if (!user) {

    const passwordHash =
      await bcrypt.hash(
        email,
        10
      );

    user =
      await User.create({
        email,
        fullName: name,
        role: "candidate",
        passwordHash,
        imageCid,
      });

  } else {

    if (imageCid) {

      user.imageCid =
        imageCid;

      await user.save();
    }
  }

  const count =
    await Candidate.countDocuments({
      electionId,
    });

  return Candidate.create({
    electionId,
    userId: user._id,
    email,
    name,
    bio,
    imageCid,
    candidateIndexOnChain: count,
  });
};

const getCandidates = async (electionId) => {
    return Candidate.find({
    electionId,
  }).populate(
    "userId",
    "fullName imageCid email"
  );
};

export default {
  createCandidate,
  getCandidates,
};