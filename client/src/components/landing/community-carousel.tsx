
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface Community {
  id: number;
  name: string;
  image_path: string;
}

export default function CommunityCarousel() {
  // Using Unsplash images for the carousel
  const communities = [
    { id: 1, name: 'Community 1', image_path: 'https://source.unsplash.com/800x600/?house,community' },
    { id: 2, name: 'Community 2', image_path: 'https://source.unsplash.com/800x600/?apartment,building' },
    { id: 3, name: 'Community 3', image_path: 'https://source.unsplash.com/800x600/?neighborhood,residential' },
    { id: 4, name: 'Community 4', image_path: 'https://source.unsplash.com/800x600/?modern,housing' },
  ];

  // Create two rows of communities with unique keys
  const rowOne = communities.map((c, i) => ({ ...c, uniqueId: `row1-${c.id}` }));
  const rowTwo = communities.map((c, i) => ({ ...c, uniqueId: `row2-${c.id}` }));

  return (
    <div className="relative w-full overflow-hidden h-[300px]">
      {/* Top row - moving right */}
      <motion.div
        className="flex gap-4 mb-4"
        animate={{
          x: [-1500, 0],
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
            key={community.uniqueId}
            className="flex-shrink-0 w-[300px] h-[150px] overflow-hidden rounded-lg"
          >
            <div
              className="w-full h-full bg-cover bg-center transition-transform hover:scale-110"
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
          x: [0, -1500],
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
            key={community.uniqueId}
            className="flex-shrink-0 w-[300px] h-[150px] overflow-hidden rounded-lg"
          >
            <div
              className="w-full h-full bg-cover bg-center transition-transform hover:scale-110"
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
