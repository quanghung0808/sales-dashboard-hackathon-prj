'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SettingsService } from '@/services/repositories/SettingsService';
import { AISettings } from '@/types';
import { Bot, Key, Eye, EyeOff, Save, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

const AI_MODEL_OPTIONS: AISettings['selectedModel'][] = [
  'GPT-5',
  'GPT-4.1',
  'Claude Sonnet',
  'Claude Opus',
  'Gemini 2.5 Pro',
  'Gemini Flash',
  'DeepSeek',
  'Llama 4',
];

export default function AISettingsPage() {
  const queryClient = useQueryClient();
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showClaudeKey, setShowClaudeKey] = useState(false);

  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [claudeApiKey, setClaudeApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState<AISettings['selectedModel']>('GPT-5');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  const { data: settings } = useQuery({
    queryKey: ['aiSettings'],
    queryFn: () => SettingsService.getAISettings(),
  });

  useEffect(() => {
    if (settings) {
      setOpenaiApiKey(settings.openaiApiKey);
      setGeminiApiKey(settings.geminiApiKey);
      setClaudeApiKey(settings.claudeApiKey);
      setSelectedModel(settings.selectedModel);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: (newSettings: Partial<AISettings>) => SettingsService.updateAISettings(newSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiSettings'] });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Format validation checks (mock mode format enforcement)
    if (openaiApiKey && !openaiApiKey.startsWith('sk-')) {
      setValidationError('OpenAI API Key phải bắt đầu bằng "sk-"');
      return;
    }
    if (geminiApiKey && !geminiApiKey.startsWith('AIza')) {
      setValidationError('Gemini API Key phải bắt đầu bằng "AIza"');
      return;
    }
    if (claudeApiKey && !claudeApiKey.startsWith('sk-ant-')) {
      setValidationError('Claude API Key phải bắt đầu bằng "sk-ant-"');
      return;
    }

    saveMutation.mutate({
      openaiApiKey,
      geminiApiKey,
      claudeApiKey,
      selectedModel,
    });
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Bot className="h-6 w-6 text-indigo-500" /> Cấu Hình AI
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Quản lý tích hợp AI cho tính năng phân tích cuộc gọi, chấm điểm lead & sinh báo cáo tự động (Mock Mode)
        </p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-4 text-sm font-semibold text-emerald-400">
          <CheckCircle2 className="h-5 w-5" /> Đã lưu cấu hình AI thành công vào LocalStorage!
        </div>
      )}

      {validationError && (
        <div className="flex items-center gap-2 rounded-2xl bg-rose-500/15 border border-rose-500/30 p-4 text-sm font-semibold text-rose-400">
          <AlertCircle className="h-5 w-5" /> {validationError}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Model Selector Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" /> Chọn Mô Hình AI Mặc Định
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Mô hình AI xử lý chính</label>
              <Select value={selectedModel} onChange={(e: any) => setSelectedModel(e.target.value)}>
                {AI_MODEL_OPTIONS.map((model) => (
                  <option key={model} value={model}>
                    {model} {model === 'GPT-5' || model === 'Gemini 2.5 Pro' ? '(Khuyên dùng - Siêu tốc)' : ''}
                  </option>
                ))}
              </Select>
            </div>
            <p className="text-xs text-slate-500">
              Mô hình đã chọn sẽ được dùng để phân tích cảm xúc khách hàng, tính toán điểm chốt đơn và đề xuất phản hồi cho Sales.
            </p>
          </CardContent>
        </Card>

        {/* API Keys Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-500" /> Cấu Hình API Keys
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* OpenAI Key */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold flex items-center justify-between">
                <span>OpenAI API Key</span>
                <span className="text-[10px] text-slate-400">Định dạng: sk-...</span>
              </label>
              <div className="relative">
                <Input
                  type={showOpenAIKey ? 'text' : 'password'}
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  placeholder="sk-proj-..."
                />
                <button
                  type="button"
                  onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showOpenAIKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Gemini Key */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold flex items-center justify-between">
                <span>Google Gemini API Key</span>
                <span className="text-[10px] text-slate-400">Định dạng: AIza...</span>
              </label>
              <div className="relative">
                <Input
                  type={showGeminiKey ? 'text' : 'password'}
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showGeminiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Claude Key */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold flex items-center justify-between">
                <span>Anthropic Claude API Key</span>
                <span className="text-[10px] text-slate-400">Định dạng: sk-ant-...</span>
              </label>
              <div className="relative">
                <Input
                  type={showClaudeKey ? 'text' : 'password'}
                  value={claudeApiKey}
                  onChange={(e) => setClaudeApiKey(e.target.value)}
                  placeholder="sk-ant-api..."
                />
                <button
                  type="button"
                  onClick={() => setShowClaudeKey(!showClaudeKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showClaudeKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="gradient" className="flex items-center gap-2 h-11 px-6">
            <Save className="h-4 w-4" /> Lưu Cấu Hình AI
          </Button>
        </div>
      </form>
    </div>
  );
}
