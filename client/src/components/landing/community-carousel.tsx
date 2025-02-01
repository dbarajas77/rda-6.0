import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

interface Community {
  id: number;
  name: string;
  image_path: string;
}

export default function CommunityCarousel() {
  // Temporary data for demonstration
  const communities = [
    { id: 1, name: 'Community 1', image_path: 'community-bg.jpg' },
    { id: 2, name: 'Community 2', image_path: 'community-bg.jpg' },
    { id: 3, name: 'Community 3', image_path: 'community-bg.jpg' },
  ];

  // Create two rows of communities by duplicating the array
  const rowOne = [...communities, ...communities];
  const rowTwo = [...communities, ...communities];

  return (
    <div className="relative w-full overflow-hidden h-[300px]">
      {/* Top row - moving right */}
      <motion.div
        className="flex gap-4 mb-4"
        animate={{
          x: [-225 * (communities.length + 2), 0],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 40,
            ease: "linear",
          },
        }}
      >
        {rowOne.map((community) => (
          <Card
            key={`${community.id}-1`}
            className="flex-shrink-0 w-[200px] sm:w-[225px] h-[120px] sm:h-[150px] overflow-hidden"
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${community.image_path})`,
              }}
            />
          </Card>
        ))}
      </motion.div>

      {/* Bottom row - moving left */}
      <motion.div
        className="flex gap-4"
        animate={{
          x: [0, -225 * (communities.length + 2)],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 40,
            ease: "linear",
          },
        }}
      >
        {rowTwo.map((community) => (
          <Card
            key={`${community.id}-2`}
            className="flex-shrink-0 w-[200px] sm:w-[225px] h-[120px] sm:h-[150px] overflow-hidden"
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${community.image_path})`,
              }}
            />
          </Card>
        ))}
      </motion.div>
    </div>
  );
}