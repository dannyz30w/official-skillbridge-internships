import { EtheralShadow } from '@/components/ui/etheral-shadow';

const DemoOne = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <EtheralShadow
        color="rgba(128, 128, 128, 1)"
        animation={{ scale: 100, speed: 90 }}
        noise={{ opacity: 1, scale: 1.2 }}
        sizing="fill"
        showTitle
      />
    </div>
  );
};

export { DemoOne };
