import { motion } from "framer-motion";

const Loading = ({ type = "card", count = 3 }) => {
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <motion.div 
            className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-32"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ backgroundSize: "200% 100%" }}
          />
          <motion.div 
            className="h-6 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-16"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
            style={{ backgroundSize: "200% 100%" }}
          />
        </div>
        <motion.div 
          className="h-3 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-3/4 mb-2"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          style={{ backgroundSize: "200% 100%" }}
        />
        <motion.div 
          className="h-3 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-1/2"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          style={{ backgroundSize: "200% 100%" }}
        />
      </div>
    </div>
  );

  const SkeletonList = () => (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between py-3 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <motion.div 
            className="w-8 h-8 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ backgroundSize: "200% 100%" }}
          />
          <div>
            <motion.div 
              className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-32 mb-1"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
              style={{ backgroundSize: "200% 100%" }}
            />
            <motion.div 
              className="h-3 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-20"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              style={{ backgroundSize: "200% 100%" }}
            />
          </div>
        </div>
        <motion.div 
          className="h-6 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-16"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          style={{ backgroundSize: "200% 100%" }}
        />
      </div>
    </div>
  );

  const SkeletonStats = () => (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <motion.div 
          className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-24"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ backgroundSize: "200% 100%" }}
        />
        <motion.div 
          className="w-8 h-8 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
          style={{ backgroundSize: "200% 100%" }}
        />
      </div>
      <motion.div 
        className="h-8 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded w-20"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        style={{ backgroundSize: "200% 100%" }}
      />
    </div>
  );

  if (type === "list") {
    return (
      <div className="space-y-4">
        {[...Array(count)].map((_, i) => (
          <SkeletonList key={i} />
        ))}
      </div>
    );
  }

  if (type === "stats") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(count)].map((_, i) => (
          <SkeletonStats key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default Loading;