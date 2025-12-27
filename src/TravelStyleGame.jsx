import React, { useState } from 'react';
import { Clock } from 'lucide-react';

const TravelStyleGame = () => {
  const [gameState, setGameState] = useState('intro');
  const [playerScore, setPlayerScore] = useState(0);
  const [gfScore, setGfScore] = useState(0);
  const [currentDay, setCurrentDay] = useState(1);
  const [storyPath, setStoryPath] = useState([]);
  const [gameLog, setGameLog] = useState([]);

  const totalDays = 7;

  // Story tree structure
  const storyTree = {
    start: {
      situation: "You arrive at the city. Where should you go first?",
      gfAction: "Checks into hotel as planned",
      gfPoints: 3,
      safe: {
        text: "Head to the famous landmark",
        points: { min: 2, max: 3 },
        outcome: "Nice photos at the landmark",
        next: "landmark_safe"
      },
      risky: {
        text: "Follow that street musician",
        points: { min: -2, max: 7 },
        goodOutcome: "Musician leads you to hidden jazz bar!",
        badOutcome: "You wander into tourist trap...",
        next: { good: "musician_good", bad: "musician_bad" }
      }
    },
    landmark_safe: {
      situation: "Getting late. Time for dinner.",
      gfAction: "Dines at Michelin restaurant",
      gfPoints: 4,
      safe: {
        text: "Eat at hotel restaurant",
        points: { min: 2, max: 3 },
        outcome: "Decent meal",
        next: "hotel_dinner"
      },
      risky: {
        text: "Try that alley BBQ place",
        points: { min: -3, max: 8 },
        goodOutcome: "Best meal ever! Owner gives free drinks!",
        badOutcome: "Food poisoning... bathroom night",
        next: { good: "bbq_good", bad: "bbq_bad" }
      }
    },
    musician_good: {
      situation: "Jazz bar friends invite you tomorrow!",
      gfAction: "Visits National Museum",
      gfPoints: 4,
      safe: {
        text: "Decline, explore alone",
        points: { min: 2, max: 3 },
        outcome: "Visit local shops",
        next: "decline_friends"
      },
      risky: {
        text: "Join mountain day trip",
        points: { min: -2, max: 9 },
        goodOutcome: "Epic adventure! Secret hot spring!",
        badOutcome: "Miss last bus, have to hitchhike...",
        next: { good: "mountain_good", bad: "mountain_bad" }
      }
    },
    musician_bad: {
      situation: "In tourist area. Local offers to guide you.",
      gfAction: "Visits National Museum",
      gfPoints: 4,
      safe: {
        text: "Check map instead",
        points: { min: 1, max: 2 },
        outcome: "Find decent cafe",
        next: "tourist_escape"
      },
      risky: {
        text: "Trust them",
        points: { min: -3, max: 6 },
        goodOutcome: "They're genuine! See real local life!",
        badOutcome: "Led to cousin's overpriced shop...",
        next: { good: "guide_good", bad: "guide_bad" }
      }
    },
    hotel_dinner: {
      situation: "Perfect weather morning!",
      gfAction: "Visits botanical garden",
      gfPoints: 3,
      safe: {
        text: "Visit shopping district",
        points: { min: 2, max: 3 },
        outcome: "Buy nice souvenirs",
        next: "shopping"
      },
      risky: {
        text: "Rent scooter, explore coast",
        points: { min: -2, max: 8 },
        goodOutcome: "Find hidden beach, no tourists!",
        badOutcome: "Lost, out of gas...",
        next: { good: "scooter_good", bad: "scooter_bad" }
      }
    },
    bbq_good: {
      situation: "Owner recommends secret night market.",
      gfAction: "Visits botanical garden",
      gfPoints: 3,
      safe: {
        text: "Regular night market",
        points: { min: 2, max: 3 },
        outcome: "Enjoy street food",
        next: "market_normal"
      },
      risky: {
        text: "Find secret market",
        points: { min: -1, max: 7 },
        goodOutcome: "Amazing food and street festival!",
        badOutcome: "Empty lot with two carts...",
        next: { good: "market_secret", bad: "market_fail" }
      }
    },
    bbq_bad: {
      situation: "Recovered. Locals say festival tonight.",
      gfAction: "Visits botanical garden",
      gfPoints: 3,
      safe: {
        text: "Stay in and rest",
        points: { min: 1, max: 2 },
        outcome: "Room service and movies",
        next: "rest"
      },
      risky: {
        text: "Rally, go to festival",
        points: { min: -2, max: 8 },
        goodOutcome: "Feel great! Festival incredible!",
        badOutcome: "Feel worse, leave early...",
        next: { good: "festival_good", bad: "festival_bad" }
      }
    },
    decline_friends: {
      situation: "Meet solo backpacker at hostel.",
      gfAction: "Designer store shopping",
      gfPoints: 4,
      safe: {
        text: "Chat, continue plans",
        points: { min: 2, max: 3 },
        outcome: "Visit museum alone",
        next: "museum_solo"
      },
      risky: {
        text: "Team up for adventure",
        points: { min: -1, max: 7 },
        goodOutcome: "They know best spots! Great day!",
        badOutcome: "Boring, slow you down...",
        next: { good: "backpack_good", bad: "backpack_bad" }
      }
    },
    mountain_good: {
      situation: "Locals mention temple sunrise hike.",
      gfAction: "Designer store shopping",
      gfPoints: 4,
      safe: {
        text: "Enjoy hot spring",
        points: { min: 2, max: 3 },
        outcome: "Relaxing spring day",
        next: "spring"
      },
      risky: {
        text: "Early sunrise hike",
        points: { min: -2, max: 9 },
        goodOutcome: "Best sunrise! Monks invite you for tea!",
        badOutcome: "Too foggy, twisted ankle...",
        next: { good: "temple_good", bad: "temple_bad" }
      }
    },
    mountain_bad: {
      situation: "Finally back. Ride offer to viewpoint.",
      gfAction: "Designer store shopping",
      gfPoints: 4,
      safe: {
        text: "Taxi back to city",
        points: { min: 1, max: 2 },
        outcome: "Head back tired",
        next: "tired"
      },
      risky: {
        text: "Accept ride",
        points: { min: -3, max: 6 },
        goodOutcome: "Amazing sunset! Cool people!",
        badOutcome: "Car breaks down halfway...",
        next: { good: "view_good", bad: "view_bad" }
      }
    },
    tourist_escape: {
      situation: "Overhear about cooking class at cafe.",
      gfAction: "Visits art gallery",
      gfPoints: 3,
      safe: {
        text: "Continue cafe hopping",
        points: { min: 2, max: 3 },
        outcome: "Nice coffee, meet travelers",
        next: "cafe"
      },
      risky: {
        text: "Sign up for class",
        points: { min: -2, max: 7 },
        goodOutcome: "Learn authentic dishes! Get recipes!",
        badOutcome: "Tourist scam, teaches nothing...",
        next: { good: "cook_good", bad: "cook_bad" }
      }
    },
    guide_good: {
      situation: "Guide offers family dinner invite.",
      gfAction: "Visits art gallery",
      gfPoints: 3,
      safe: {
        text: "Decline, explore more",
        points: { min: 2, max: 3 },
        outcome: "Explore old town",
        next: "oldtown"
      },
      risky: {
        text: "Accept dinner",
        points: { min: -1, max: 8 },
        goodOutcome: "Amazing meal! Treated like family!",
        badOutcome: "Awkward, understand no one...",
        next: { good: "dinner_good", bad: "dinner_bad" }
      }
    },
    guide_bad: {
      situation: "Escape shop. Performer invites to show.",
      gfAction: "Visits art gallery",
      gfPoints: 3,
      safe: {
        text: "Back to tourist areas",
        points: { min: 1, max: 2 },
        outcome: "Visit standard attractions",
        next: "standard"
      },
      risky: {
        text: "Go to underground show",
        points: { min: -3, max: 8 },
        goodOutcome: "Mind-blowing! Meet amazing artists!",
        badOutcome: "Weird, uncomfortable, leave early...",
        next: { good: "show_good", bad: "show_bad" }
      }
    },
    shopping: {
      situation: "Local festival happening!",
      gfAction: "Spa day",
      gfPoints: 4,
      safe: {
        text: "Stick to sightseeing",
        points: { min: 2, max: 3 },
        outcome: "Standard activities",
        next: "end"
      },
      risky: {
        text: "Dive into festival",
        points: { min: -2, max: 9 },
        goodOutcome: "Epic cultural experience!",
        badOutcome: "Too crowded...",
        next: { good: "end", bad: "end" }
      }
    },
    scooter_good: {
      situation: "Locals having bonfire party at beach.",
      gfAction: "Spa day",
      gfPoints: 4,
      safe: {
        text: "Enjoy beach alone",
        points: { min: 2, max: 3 },
        outcome: "Peaceful beach day",
        next: "end"
      },
      risky: {
        text: "Join bonfire party",
        points: { min: -1, max: 8 },
        goodOutcome: "Amazing night! Lifelong friends!",
        badOutcome: "Too wild, leave early...",
        next: { good: "end", bad: "end" }
      }
    },
    scooter_bad: {
      situation: "Back in city. Last adventure?",
      gfAction: "Spa day",
      gfPoints: 4,
      safe: {
        text: "Play safe and relax",
        points: { min: 1, max: 2 },
        outcome: "Chill last days",
        next: "end"
      },
      risky: {
        text: "Sketchy food tour",
        points: { min: -3, max: 7 },
        goodOutcome: "Best food discoveries!",
        badOutcome: "Food poisoning again...",
        next: { good: "end", bad: "end" }
      }
    },
    market_normal: {
      situation: "Final days!",
      gfAction: "Observatory visit",
      gfPoints: 4,
      safe: {
        text: "Popular sites",
        points: { min: 2, max: 3 },
        outcome: "Good ending",
        next: "end"
      },
      risky: {
        text: "Last adventure",
        points: { min: -2, max: 7 },
        goodOutcome: "Great finale!",
        badOutcome: "Meh ending",
        next: { good: "end", bad: "end" }
      }
    },
    market_secret: {
      situation: "Final days!",
      gfAction: "Observatory visit",
      gfPoints: 4,
      safe: {
        text: "Popular sites",
        points: { min: 2, max: 3 },
        outcome: "Good ending",
        next: "end"
      },
      risky: {
        text: "Last adventure",
        points: { min: -2, max: 8 },
        goodOutcome: "Epic finale!",
        badOutcome: "Rough ending",
        next: { good: "end", bad: "end" }
      }
    },
    market_fail: {
      situation: "Final days!",
      gfAction: "Observatory visit",
      gfPoints: 4,
      safe: {
        text: "Popular sites",
        points: { min: 2, max: 3 },
        outcome: "Ok ending",
        next: "end"
      },
      risky: {
        text: "Risk it all",
        points: { min: -3, max: 7 },
        goodOutcome: "Redeemed!",
        badOutcome: "Bad luck",
        next: { good: "end", bad: "end" }
      }
    },
    rest: {
      situation: "Recovered. Explore!",
      gfAction: "Observatory visit",
      gfPoints: 4,
      safe: {
        text: "Light sightseeing",
        points: { min: 2, max: 3 },
        outcome: "Safe finish",
        next: "end"
      },
      risky: {
        text: "Make up lost time",
        points: { min: -2, max: 8 },
        goodOutcome: "Strong finish!",
        badOutcome: "Tired ending",
        next: { good: "end", bad: "end" }
      }
    },
    festival_good: {
      situation: "On high! Keep going?",
      gfAction: "Observatory visit",
      gfPoints: 4,
      safe: {
        text: "End on high note",
        points: { min: 2, max: 3 },
        outcome: "Happy ending",
        next: "end"
      },
      risky: {
        text: "Push your luck",
        points: { min: -2, max: 9 },
        goodOutcome: "Legendary!",
        badOutcome: "Peaked too early",
        next: { good: "end", bad: "end" }
      }
    },
    festival_bad: {
      situation: "Rough moment. Redemption?",
      gfAction: "Observatory visit",
      gfPoints: 4,
      safe: {
        text: "Take it easy",
        points: { min: 1, max: 2 },
        outcome: "Quiet ending",
        next: "end"
      },
      risky: {
        text: "One more shot",
        points: { min: -3, max: 7 },
        goodOutcome: "Comeback!",
        badOutcome: "Rough trip",
        next: { good: "end", bad: "end" }
      }
    },
    museum_solo: {
      situation: "Last stretch!",
      gfAction: "Final shopping",
      gfPoints: 3,
      safe: {
        text: "Finish peacefully",
        points: { min: 2, max: 3 },
        outcome: "Calm ending",
        next: "end"
      },
      risky: {
        text: "Last thrill",
        points: { min: -2, max: 7 },
        goodOutcome: "Worth it!",
        badOutcome: "Should've relaxed",
        next: { good: "end", bad: "end" }
      }
    },
    backpack_good: {
      situation: "Friend has one more idea...",
      gfAction: "Final shopping",
      gfPoints: 3,
      safe: {
        text: "Part ways",
        points: { min: 2, max: 3 },
        outcome: "Good goodbye",
        next: "end"
      },
      risky: {
        text: "Last adventure together",
        points: { min: -1, max: 8 },
        goodOutcome: "Best decision!",
        badOutcome: "Overstayed",
        next: { good: "end", bad: "end" }
      }
    },
    backpack_bad: {
      situation: "Free again. Make it count?",
      gfAction: "Final shopping",
      gfPoints: 3,
      safe: {
        text: "Solo exploration",
        points: { min: 1, max: 2 },
        outcome: "Independent ending",
        next: "end"
      },
      risky: {
        text: "Wing it completely",
        points: { min: -3, max: 7 },
        goodOutcome: "Freedom wins!",
        badOutcome: "Lost cause",
        next: { good: "end", bad: "end" }
      }
    },
    spring: {
      situation: "Refreshed!",
      gfAction: "Sunset cruise",
      gfPoints: 4,
      safe: {
        text: "Gentle finish",
        points: { min: 2, max: 3 },
        outcome: "Zen ending",
        next: "end"
      },
      risky: {
        text: "Go big",
        points: { min: -2, max: 8 },
        goodOutcome: "Glory!",
        badOutcome: "Crashed",
        next: { good: "end", bad: "end" }
      }
    },
    temple_good: {
      situation: "Blessed by monks. Continue magic?",
      gfAction: "Sunset cruise",
      gfPoints: 4,
      safe: {
        text: "Preserve magic",
        points: { min: 2, max: 3 },
        outcome: "Spiritual ending",
        next: "end"
      },
      risky: {
        text: "Push limits",
        points: { min: -1, max: 9 },
        goodOutcome: "Transcendent!",
        badOutcome: "Fell from grace",
        next: { good: "end", bad: "end" }
      }
    },
    temple_bad: {
      situation: "Injured but not defeated?",
      gfAction: "Sunset cruise",
      gfPoints: 4,
      safe: {
        text: "Recover and relax",
        points: { min: 1, max: 2 },
        outcome: "Healing ending",
        next: "end"
      },
      risky: {
        text: "Ignore pain",
        points: { min: -3, max: 6 },
        goodOutcome: "Tough it out!",
        badOutcome: "Regrets",
        next: { good: "end", bad: "end" }
      }
    },
    tired: {
      situation: "Rest or explore?",
      gfAction: "Farewell dinner",
      gfPoints: 4,
      safe: {
        text: "Rest up",
        points: { min: 1, max: 2 },
        outcome: "Tired ending",
        next: "end"
      },
      risky: {
        text: "Power through",
        points: { min: -2, max: 7 },
        goodOutcome: "Second wind!",
        badOutcome: "Exhausted",
        next: { good: "end", bad: "end" }
      }
    },
    view_good: {
      situation: "New friends!",
      gfAction: "Farewell dinner",
      gfPoints: 4,
      safe: {
        text: "Say goodbye",
        points: { min: 2, max: 3 },
        outcome: "Sweet ending",
        next: "end"
      },
      risky: {
        text: "Keep party going",
        points: { min: -1, max: 8 },
        goodOutcome: "Never forget!",
        badOutcome: "Too much",
        next: { good: "end", bad: "end" }
      }
    },
    view_bad: {
      situation: "Tough luck. Change it?",
      gfAction: "Farewell dinner",
      gfPoints: 4,
      safe: {
        text: "Accept defeat",
        points: { min: 1, max: 2 },
        outcome: "Learning ending",
        next: "end"
      },
      risky: {
        text: "Desperate move",
        points: { min: -3, max: 7 },
        goodOutcome: "Miracle!",
        badOutcome: "Total disaster",
        next: { good: "end", bad: "end" }
      }
    },
    cafe: {
      situation: "Final day!",
      gfAction: "Souvenir shopping",
      gfPoints: 3,
      safe: {
        text: "Wrap up nicely",
        points: { min: 2, max: 3 },
        outcome: "Pleasant ending",
        next: "end"
      },
      risky: {
        text: "Last chaos",
        points: { min: -2, max: 7 },
        goodOutcome: "Saved best!",
        badOutcome: "Ruined it",
        next: { good: "end", bad: "end" }
      }
    },
    cook_good: {
      situation: "Skilled up! Use it?",
      gfAction: "Souvenir shopping",
      gfPoints: 3,
      safe: {
        text: "Simple finish",
        points: { min: 2, max: 3 },
        outcome: "Satisfied",
        next: "end"
      },
      risky: {
        text: "Cook for strangers",
        points: { min: -1, max: 8 },
        goodOutcome: "Everyone loves it!",
        badOutcome: "Kitchen disaster",
        next: { good: "end", bad: "end" }
      }
    },
    cook_bad: {
      situation: "Scammed but learning!",
      gfAction: "Souvenir shopping",
      gfPoints: 3,
      safe: {
        text: "Cut losses",
        points: { min: 1, max: 2 },
        outcome: "Lesson learned",
        next: "end"
      },
      risky: {
        text: "Try again",
        points: { min: -3, max: 6 },
        goodOutcome: "Perseverance!",
        badOutcome: "Double scam",
        next: { good: "end", bad: "end" }
      }
    },
    oldtown: {
      situation: "Last day!",
      gfAction: "Airport prep",
      gfPoints: 3,
      safe: {
        text: "Safe departure",
        points: { min: 2, max: 3 },
        outcome: "Smooth ending",
        next: "end"
      },
      risky: {
        text: "Final escapade",
        points: { min: -2, max: 7 },
        goodOutcome: "No regrets!",
        badOutcome: "Flight risk",
        next: { good: "end", bad: "end" }
      }
    },
    dinner_good: {
      situation: "They want you longer!",
      gfAction: "Airport prep",
      gfPoints: 3,
      safe: {
        text: "Politely leave",
        points: { min: 2, max: 3 },
        outcome: "Grateful",
        next: "end"
      },
      risky: {
        text: "Stay one more night",
        points: { min: -2, max: 9 },
        goodOutcome: "Unforgettable!",
        badOutcome: "Overstayed",
        next: { good: "end", bad: "end" }
      }
    },
    dinner_bad: {
      situation: "Awkward but free!",
      gfAction: "Airport prep",
      gfPoints: 3,
      safe: {
        text: "End it here",
        points: { min: 1, max: 2 },
        outcome: "Escaped",
        next: "end"
      },
      risky: {
        text: "Find real locals",
        points: { min: -3, max: 6 },
        goodOutcome: "Found them!",
        badOutcome: "More awkward",
        next: { good: "end", bad: "end" }
      }
    },
    standard: {
      situation: "Trip ending...",
      gfAction: "Goodbye photos",
      gfPoints: 3,
      safe: {
        text: "Normal finish",
        points: { min: 2, max: 3 },
        outcome: "Standard",
        next: "end"
      },
      risky: {
        text: "Last ditch",
        points: { min: -2, max: 7 },
        goodOutcome: "Hidden gem!",
        badOutcome: "Wasted time",
        next: { good: "end", bad: "end" }
      }
    },
    show_good: {
      situation: "Artist life!",
      gfAction: "Goodbye photos",
      gfPoints: 3,
      safe: {
        text: "Keep memorable",
        points: { min: 2, max: 3 },
        outcome: "Artistic",
        next: "end"
      },
      risky: {
        text: "Join next show",
        points: { min: -1, max: 8 },
        goodOutcome: "Star moment!",
        badOutcome: "Stage fright",
        next: { good: "end", bad: "end" }
      }
    },
    show_bad: {
      situation: "Escape complete!",
      gfAction: "Goodbye photos",
      gfPoints: 3,
      safe: {
        text: "Play safe",
        points: { min: 1, max: 2 },
        outcome: "Relief",
        next: "end"
      },
      risky: {
        text: "Better show",
        points: { min: -3, max: 7 },
        goodOutcome: "Redeemed!",
        badOutcome: "Worse show",
        next: { good: "end", bad: "end" }
      }
    }
  };

  const getCurrentNode = () => {
    if (storyPath.length === 0) return storyTree.start;
    const lastPath = storyPath[storyPath.length - 1];
    return storyTree[lastPath] || storyTree.start;
  };

  const makeChoice = (isSafe, random) => {
    const currentNode = getCurrentNode();
    if (!currentNode) return;

    const choice = isSafe ? currentNode.safe : currentNode.risky;
    let points = 0;
    let outcome = '';
    let nextPath = '';

    if (isSafe) {
      points = random < 0.9 ? choice.points.max : choice.points.min;
      outcome = choice.outcome;
      nextPath = choice.next;
    } else {
      const isGood = random < 0.5;
      if (isGood) {
        points = choice.points.max;
        outcome = choice.goodOutcome;
        nextPath = choice.next.good;
      } else {
        points = choice.points.min;
        outcome = choice.badOutcome;
        nextPath = choice.next.bad;
      }
    }

    setPlayerScore(prev => prev + points);
    const gfPoints = currentNode.gfPoints;
    setGfScore(prev => prev + gfPoints);

    setGameLog(prev => [...prev, {
      day: currentDay,
      player: `${choice.text} → ${outcome} (${points > 0 ? '+' : ''}${points})`,
      gf: `${currentNode.gfAction} (+${gfPoints})`
    }]);

    setStoryPath(prev => [...prev, nextPath]);

    if (nextPath === "end" || currentDay >= totalDays) {
      setGameState('ended');
    } else {
      setCurrentDay(prev => prev + 1);
    }
  };

  const startGame = () => {
    setGameState('playing');
    setPlayerScore(0);
    setGfScore(0);
    setCurrentDay(1);
    setStoryPath([]);
    setGameLog([]);
  };

  const restartGame = () => {
    setGameState('intro');
  };

  if (gameState === 'intro') {
    return (
      <div className="w-full h-screen bg-gradient-to-b from-blue-400 to-purple-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl text-center">
          <h1 className="text-4xl font-bold mb-4 text-purple-600">Travel Style Wars</h1>
          <div className="mb-6 text-gray-700 space-y-3">
            <p className="text-lg">You and your girlfriend traveled to a famous city.</p>
            <p>But your travel styles are completely different!</p>
            <p className="font-semibold text-purple-600">Girlfriend: Plans everything (J type)</p>
            <p className="font-semibold text-blue-600">You: Spontaneous wanderer (P type)</p>
            <p className="text-xl font-bold mt-4">After 7 days, who will be happier?</p>
            <p className="text-sm text-gray-600 mt-4">Every choice branches the story!</p>
          </div>
          <button 
            onClick={startGame}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg text-xl font-bold hover:bg-purple-700 transition"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'ended') {
    const winner = playerScore > gfScore ? 'player' : playerScore < gfScore ? 'gf' : 'tie';
    return (
      <div className="w-full h-screen bg-gradient-to-b from-purple-400 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-3xl">
          <h1 className="text-4xl font-bold mb-6 text-center">
            {winner === 'player' && '🎉 You Won!'}
            {winner === 'gf' && '😅 Your Girlfriend Won...'}
            {winner === 'tie' && '🤝 It\'s a Tie!'}
          </h1>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">You (Spontaneous)</p>
              <p className="text-4xl font-bold text-blue-600">{playerScore}</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Girlfriend (Planner)</p>
              <p className="text-4xl font-bold text-purple-600">{gfScore}</p>
            </div>
          </div>
          <div className="mb-6 max-h-64 overflow-y-auto border rounded p-4">
            <h3 className="font-bold mb-2">Your Journey:</h3>
            {gameLog.map((log, idx) => (
              <div key={idx} className="mb-3 pb-3 border-b">
                <p className="font-semibold text-sm text-gray-600">Day {log.day}</p>
                <p className="text-sm text-blue-700">👤 {log.player}</p>
                <p className="text-sm text-purple-700">👩 {log.gf}</p>
              </div>
            ))}
          </div>
          <button 
            onClick={restartGame}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const currentNode = getCurrentNode();
  
  if (!currentNode) {
    return null;
  }

  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col">
      <div className="h-1/2 bg-gradient-to-b from-purple-300 to-purple-400 border-b-4 border-white p-4 relative">
        <div className="absolute top-4 left-4 bg-white rounded-lg px-4 py-2 shadow-lg">
          <p className="text-sm text-gray-600">Girlfriend (Planner)</p>
          <p className="text-2xl font-bold text-purple-600">{gfScore} pts</p>
        </div>
        <div className="absolute top-4 right-4 bg-white rounded-lg px-4 py-2 shadow-lg">
          <Clock className="inline mr-2" size={20} />
          <span className="font-bold">Day {currentDay}/{totalDays}</span>
        </div>
        <div className="flex items-center justify-center h-full">
          <div className="bg-white rounded-lg p-6 shadow-xl text-center max-w-md">
            <div className="text-6xl mb-2">👩</div>
            <p className="text-lg font-semibold text-purple-700">{currentNode.gfAction}</p>
            <p className="text-sm text-gray-600 mt-2">Following her perfect itinerary...</p>
            <p className="text-xs text-gray-500 mt-2">Will earn: +{currentNode.gfPoints} pts</p>
          </div>
        </div>
      </div>

      <div className="h-1/2 bg-gradient-to-b from-blue-300 to-blue-400 p-4 relative">
        <div className="absolute top-4 left-4 bg-white rounded-lg px-4 py-2 shadow-lg">
          <p className="text-sm text-gray-600">You (Spontaneous)</p>
          <p className="text-2xl font-bold text-blue-600">{playerScore} pts</p>
        </div>
        
        <div className="flex items-center justify-center h-full">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-2xl">
            <h2 className="text-xl font-bold mb-2 text-center text-gray-800">
              {currentNode.situation}
            </h2>
            <p className="text-center text-sm text-gray-600 mb-6">What will you do?</p>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => makeChoice(true, Math.random())}
                className="bg-gradient-to-br from-green-400 to-green-600 text-white p-6 rounded-lg hover:from-green-500 hover:to-green-700 transition shadow-lg transform hover:scale-105"
              >
                <p className="font-bold text-lg mb-2">🛡️ SAFE</p>
                <p className="text-sm">{currentNode.safe.text}</p>
                <p className="text-xs mt-3 opacity-80">Low risk, steady reward</p>
              </button>

              <button
                onClick={() => makeChoice(false, Math.random())}
                className="bg-gradient-to-br from-red-400 to-red-600 text-white p-6 rounded-lg hover:from-red-500 hover:to-red-700 transition shadow-lg transform hover:scale-105"
              >
                <p className="font-bold text-lg mb-2">⚡ RISKY</p>
                <p className="text-sm">{currentNode.risky.text}</p>
                <p className="text-xs mt-3 opacity-80">High risk, high reward... or disaster</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelStyleGame;