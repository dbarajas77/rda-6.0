import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

// Sample data - replace with actual community images
const communities = [
  { id: 1, image: "/images/community1.jpg", name: "Sunset Gardens" },
  { id: 2, image: "/images/community2.jpg", name: "Oak Valley" },
  { id: 3, image: "/images/community3.jpg", name: "Pine Ridge" },
  { id: 4, image: "/images/community4.jpg", name: "Maple Heights" },
  { id: 5, image: "/images/community5.jpg", name: "Cedar Creek" },
  { id: 6, image: "/images/community6.jpg", name: "Willow Park" },
  // Add more communities as needed
];

// Create three rows of communities by duplicating the array
const rowOne = [...communities, ...communities];
const rowTwo = [...communities, ...communities];
const rowThree = [...communities, ...communities];

export default function CommunityCarousel() {
  const [offsetX, setOffsetX] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffsetX((prev) => prev - 1);
    }, 50); // Adjust speed by changing the interval

    return () => clearInterval(interval);
  }, []);

  const rowVariants = {
    animate: (direction: number) => ({
      x: [0, direction * -275 * communities.length], // 275px is card width
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 50,
          ease: "linear",
        },
      },
    }),
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Top row - moving right */}
      <motion.div
        className="flex gap-4 mb-4"
        variants={rowVariants}
        animate="animate"
        custom={1}
      >
        {rowOne.map((community) => (
          <Card
            key={`${community.id}-1`}
            className="flex-shrink-0 w-[275px] h-[100px] overflow-hidden"
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${community.image})`,
              }}
            />
          </Card>
        ))}
      </motion.div>

      {/* Middle row - moving left */}
      <motion.div
        className="flex gap-4 mb-4"
        variants={rowVariants}
        animate="animate"
        custom={-1}
      >
        {rowTwo.map((community) => (
          <Card
            key={`${community.id}-2`}
            className="flex-shrink-0 w-[275px] h-[100px] overflow-hidden"
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${community.image})`,
              }}
            />
          </Card>
        ))}
      </motion.div>

      {/* Bottom row - moving right */}
      <motion.div
        className="flex gap-4"
        variants={rowVariants}
        animate="animate"
        custom={1}
      >
        {rowThree.map((community) => (
          <Card
            key={`${community.id}-3`}
            className="flex-shrink-0 w-[275px] h-[100px] overflow-hidden"
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${community.image})`,
              }}
            />
          </Card>
        ))}
      </motion.div>
    </div>
  );
}
