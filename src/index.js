// XXX even though ethers is not used in the code below, it's very likely
// it will be used by any DApp, so we are already including it here
const { ethers } = require("ethers");

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

const challenge = {
  name: "Ultimate Test Challenge",
  challenges: [
    {
      question: "Best Player 2023",
      answer: "Messi",
      answered_count: 0,
    },
    {
      question: "Nigeria President",
      answer: "Tinubu",
      answered_count: 0,
    },
    {
      question: "Best L2 chain",
      answer: "Cartesi",
      answered_count: 0,
    },
  ],
  participants: [],
  challenge_index: 0,
};

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  // const challengeResponse = JSON.parse(JSON.parse(ethers.toUtf8String(data["payload"])));
  const challengeResponse = ethers.toUtf8String(data["payload"]);
  // console.log(challengeResponse);
  // console.log(typeof challengeResponse);
  if (challenge.participants.length == 0) {
    console.log("Welcome to UTC first contestant " + challengeResponse);
    challenge.participants.push({
      name: challengeResponse,
      address: data["metadata"]["msg_sender"],
      questionAnswered: [],
      points: 0,
    });
    console.log(challenge);
  } else if (challenge.participants.length == 1) {
    const exist = challenge.participants.find(
      (participant) => participant.address == data["metadata"]["msg_sender"]
    );
    if (exist) {
      console.log("Cannot use the same account to contest");
      console.log(challenge);
    } else {
      console.log("Welcome to UTC final contestant " + challengeResponse);
      console.log("Pairing is now closed");
      console.log("Round One Starts Now");
      challenge.participants.push({
        name: challengeResponse,
        address: data["metadata"]["msg_sender"],
        questionAnswered: [],
        points: 0,
      });
      console.log(challenge);
    }
  } else if (challenge.participants.length == 2) {
    const msg_sender = data["metadata"]["msg_sender"];
    const exist = challenge.participants.find(
      (participant) => participant.address == msg_sender
    );
    if (exist) {
      const participantId = challenge.participants.findIndex(
        (participant) => participant.address == msg_sender
      );
      if (challenge.challenges[challenge.challenge_index].answered_count == 2) {
        challenge.challenge_index++;
        if (challenge.challenge_index > 2) {
          const arr = challenge.participants.map((item) => item.points);
          const index = arr.indexOf(Math.max(...arr));
          console.log(
            "Winner is" +
            challenge.participants[index].name +
            ", with a point of " +
            challenge.participants[index].points
          );
          challenge.challenges = [
            {
              question: "Best Player 2023",
              answer: "Messi",
              answered_count: 0,
            },
            {
              question: "Nigeria President",
              answer: "Tinubu",
              answered_count: 0,
            },
            {
              question: "Best L2 chain",
              answer: "Cartesi",
              answered_count: 0,
            },
          ];
          challenge.participants = [];
          challenge.challenge_index = 0;
          return;
        }
        console.log(challenge);
      }
      if (
        !challenge.participants[participantId].questionAnswered[
          challenge.challenge_index
        ]?.answered
      ) {
        if (
          challengeResponse ==
          challenge.challenges[challenge.challenge_index].answer
        ) {
          challenge.challenges[challenge.challenge_index].answered_count++;
          challenge.participants[participantId].points =
            challenge.participants[participantId].points + 5;
          challenge.participants[participantId].questionAnswered.push({
            answered: true,
          });
          console.log(challenge);
        } else {
          challenge.challenges[challenge.challenge_index].answered_count++;
          challenge.participants[participantId].questionAnswered.push({
            answered: true,
          });
          console.log(challenge);
        }
      } else {
        console.log("You have answered this question already");
        console.log(challenge);
      }
    } else {
      console.log("You cannot contest with this account now");
      console.log(challenge);
    }
  }

  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  return "accept";
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();
