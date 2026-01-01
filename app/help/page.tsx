"use client";

import {
  HelpCircle,
  BookOpen,
  MessageCircle,
  Mail,
  FileText,
  PlayCircle,
  Search,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HelpPage() {
  const faqCategories = [
    {
      title: "Getting Started",
      icon: PlayCircle,
      items: [
        "How do I create an account?",
        "How do I join a contest?",
        "What are the different contest types?",
      ],
    },
    {
      title: "Contests & Leagues",
      icon: BookOpen,
      items: [
        "How do daily contests work?",
        "What are season-long leagues?",
        "How does the draft work?",
      ],
    },
    {
      title: "Payments & Prizes",
      icon: FileText,
      items: [
        "How do I add funds to my wallet?",
        "When are prizes paid out?",
        "What are the withdrawal options?",
      ],
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold font-display">Help Center</h1>
          <p className="text-muted-foreground">
            Find answers to common questions or contact support
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for help..."
            className="pl-10"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Documentation</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Browse our comprehensive guides and tutorials
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Live Chat</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Chat with our support team in real-time
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Email Support</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Send us an email and we&apos;ll get back to you
            </p>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {faqCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.title}
                  className="p-6 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold">{category.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {category.items.map((item, index) => (
                      <li key={index}>
                        <button className="text-sm text-muted-foreground hover:text-primary transition-colors text-left">
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <Button variant="ghost" size="sm" className="mt-4">
                    View All
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Support */}
        <div className="p-6 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/20">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Still need help?</h3>
              <p className="text-sm text-muted-foreground">
                Our support team is here to assist you
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button>
              <MessageCircle className="h-4 w-4 mr-2" />
              Start Live Chat
            </Button>
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

