export default function Footer() {
  return (
    <footer className="w-full bg-cream py-12 px-6 pb-24 md:pb-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-heading-small font-medium text-charcoal tracking-tight">
            Sky<span className="relative">C<span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-terracotta rounded-full" /></span>ast
          </span>
          <div className="flex gap-6">
            <span className="text-body-small text-light-gray hover:text-warm-gray cursor-pointer transition-colors">About</span>
            <span className="text-body-small text-light-gray hover:text-warm-gray cursor-pointer transition-colors">Privacy</span>
            <span className="text-body-small text-light-gray hover:text-warm-gray cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
        <div className="mt-6 text-center md:text-left">
          <span className="text-caption text-light-gray">2025 SkyCast</span>
        </div>
      </div>
    </footer>
  );
}
