import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-white group-[.toaster]:to-slate-50/90 group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-slate-200/50 group-[.toaster]:shadow-premium group-[.toaster]:backdrop-blur-sm group-[.toaster]:rounded-xl group-[.toaster]:p-4",
          title: "group-[.toast]:text-slate-800 group-[.toast]:font-semibold group-[.toast]:text-sm",
          description: "group-[.toast]:text-slate-600 group-[.toast]:text-xs group-[.toast]:mt-1",
                      actionButton:
              "group-[.toast]:bg-gradient-to-r group-[.toast]:from-blue-500 group-[.toast]:to-blue-600 group-[.toast]:text-white group-[.toast]:font-medium group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm group-[.toast]:hover:shadow-glow group-[.toast]:transition-all",
            cancelButton:
              "group-[.toast]:bg-gradient-to-r group-[.toast]:from-slate-500 group-[.toast]:to-slate-600 group-[.toast]:text-white group-[.toast]:font-medium group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm group-[.toast]:hover:shadow-glow group-[.toast]:transition-all",
          closeButton: "group-[.toast]:text-slate-400 group-[.toast]:hover:text-slate-600 group-[.toast]:transition-colors",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
