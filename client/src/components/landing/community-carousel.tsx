import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const communities = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&auto=format&fit=crop&q=60",
    name: "Sunset Gardens"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1594484208280-efa00f96fc21?w=800&auto=format&fit=crop&q=60",
    name: "Oak Valley"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1565402170291-8491f14678db?w=800&auto=format&fit=crop&q=60",
    name: "Pine Ridge"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60",
    name: "Maple Heights"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&auto=format&fit=crop&q=60",
    name: "Cedar Creek"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?w=800&auto=format&fit=crop&q=60",
    name: "Willow Park"
  },
];

// Create two rows of communities by duplicating the array
const rowOne = [...communities, ...communities];
const rowTwo = [...communities, ...communities];

export default function CommunityCarousel() {
  return (
    <div className="relative w-full overflow-hidden py-8">
      {/* Top row - moving right */}
      <motion.div
        className="flex gap-4 mb-4"
        animate={{
          x: [-225 * communities.length, 0],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 50,
            ease: "linear",
          },
        }}
      >
        {rowOne.map((community) => (
          <Card
            key={`${community.id}-1`}
            className="flex-shrink-0 w-[225px] h-[150px] overflow-hidden"
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

      {/* Bottom row - moving left */}
      <motion.div
        className="flex gap-4"
        animate={{
          x: [0, -225 * communities.length],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 50,
            ease: "linear",
          },
        }}
      >
        {rowTwo.map((community) => (
          <Card
            key={`${community.id}-2`}
            className="flex-shrink-0 w-[225px] h-[150px] overflow-hidden"
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