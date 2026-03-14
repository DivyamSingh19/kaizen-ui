// SignInButton.tsx
interface SignInButtonProps {
  onClick?: () => void;
  label?: string;
}

export default function SignInButton({
  onClick,
  label = "SIGN IN",
}: SignInButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        clipPath:
          "polygon(0% 0%, calc(100% - 12px) 0%, 100% 12px, 100% 100%, 12px 100%, 0% calc(100% - 12px))",
      }}
      className="
        bg-[#AAFF00]
        text-black
        font-black
        text-lg
        tracking-widest
        uppercase
        px-10
        py-4
        transition-all
        duration-150
        hover:brightness-110
        active:scale-95
        cursor-pointer
        select-none
      "
    >
      {label}
    </button>
  );
}