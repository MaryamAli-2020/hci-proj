import { useAccessibility } from "@/hooks/use-accessibility";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";

export function AccessibilitySettings() {
  const { settings, updateSetting } = useAccessibility();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar" || i18n.language === "ur";

  const accessibilityOptions = [
    {
      id: "highContrast",
      label: "High Contrast Mode",
      description: "Increase contrast between text and background for better readability",
      ariaLabel: "Enable high contrast mode",
    },
    {
      id: "screenReaderMode",
      label: "Screen Reader Mode",
      description: "Optimize for NVDA, JAWS, VoiceOver and other screen readers",
      ariaLabel: "Enable screen reader optimizations",
    },
    {
      id: "largeText",
      label: "Large Text",
      description: "Increase font size across the application",
      ariaLabel: "Enable large text",
    },
    {
      id: "reducedMotion",
      label: "Reduce Motion",
      description: "Minimize animations and transitions",
      ariaLabel: "Enable reduced motion",
    },
    {
      id: "focusIndicators",
      label: "Enhanced Focus Indicators",
      description: "Show clear focus outlines for keyboard navigation",
      ariaLabel: "Enable enhanced focus indicators",
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-[#BF9140] hover:bg-transparent"
          aria-label="Accessibility settings"
          title="Accessibility Settings"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side={isRTL ? "left" : "right"} className="w-full sm:w-96">
        <SheetHeader>
          <SheetTitle>Accessibility Settings</SheetTitle>
          <SheetDescription>
            Customize the application for your needs. Your preferences are saved locally.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {accessibilityOptions.map((option) => (
            <div
              key={option.id}
              className="flex items-start justify-between gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              <div className="flex-1">
                <Label
                  htmlFor={option.id}
                  className="text-base font-medium cursor-pointer block mb-1"
                >
                  {option.label}
                </Label>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
              <Switch
                id={option.id}
                checked={settings[option.id as keyof typeof settings]}
                onCheckedChange={(checked) =>
                  updateSetting(option.id as keyof typeof settings, checked)
                }
                aria-label={option.ariaLabel}
              />
            </div>
          ))}
        </div>

        {/* Preset Combinations */}
        <div className="mt-8 pt-6 border-t">
          <p className="text-sm font-semibold text-gray-700 mb-3">Quick Presets</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                updateSetting("highContrast", true);
                updateSetting("largeText", true);
                updateSetting("focusIndicators", true);
              }}
              aria-label="Apply low vision preset"
            >
              Low Vision
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                updateSetting("screenReaderMode", true);
                updateSetting("focusIndicators", true);
              }}
              aria-label="Apply screen reader preset"
            >
              Screen Reader
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                updateSetting("reducedMotion", true);
                updateSetting("focusIndicators", true);
              }}
              aria-label="Apply motor control preset"
            >
              Motor Control
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                updateSetting("highContrast", false);
                updateSetting("screenReaderMode", false);
                updateSetting("largeText", false);
                updateSetting("reducedMotion", false);
                updateSetting("focusIndicators", true);
              }}
              aria-label="Reset to default settings"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* WCAG Compliance Info */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
          <p className="font-semibold text-blue-900 mb-1">WCAG 2.1 AA Compliant</p>
          <p>
            This application meets WCAG 2.1 Level AA standards for web accessibility.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
