import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthCard({
  title,
  subtitle,
  children,
}: AuthCardProps) {
  return (
    <Card className="w-full max-w-md border-slate-800 bg-slate-900/70 backdrop-blur">
      <CardHeader className="space-y-2">
        <CardTitle className="text-center text-3xl font-bold text-white">
          {title}
        </CardTitle>

        <p className="text-center text-slate-400">
          {subtitle}
        </p>
      </CardHeader>

      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}