import { cn } from "@/lib/utils";

const ProductPrice = ({ value, className }: { value: string; className?: string }) => {
  const [intValue, floatValue] = value.split(".");

  return (
    <p className={cn("text-2xl", className)}>
      <span className="text-xs align-super">$</span>
      {intValue}
      <span className="text-xs align-super">.{floatValue.padEnd(2, "0")}</span>
    </p>
  );
};

export default ProductPrice;
