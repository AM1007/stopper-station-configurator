interface HeroContentProps {
  productName: string;
  title: string;
  description: string;
}

export function HeroContent({ productName, title, description }: HeroContentProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-xl font-bold text-primary lg:text-2xl">
          {productName}
        </p>
        <h1 className="text-xl font-normal text-gray-900 lg:text-4xl">
          {title}
        </h1>
      </div>

      <article
        className="space-y-3 text-base text-gray-700 lg:text-lg"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
}