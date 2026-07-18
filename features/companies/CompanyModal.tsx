'use client';

import React, { useState, useEffect } from 'react';
import { Company } from '@/types';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (companyData: Partial<Company>) => void;
  company?: Company | null;
}

export function CompanyModal({ isOpen, onClose, onSave, company }: CompanyModalProps) {
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('💎');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [industry, setIndustry] = useState('High-End Gemstone & Diamond');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  useEffect(() => {
    if (company) {
      setName(company.name);
      setLogo(company.logo);
      setEmail(company.email);
      setPhone(company.phone);
      setAddress(company.address);
      setIndustry(company.industry);
      setStatus(company.status);
    } else {
      setName('');
      setLogo('💎');
      setEmail('');
      setPhone('');
      setAddress('');
      setIndustry('High-End Gemstone & Diamond');
      setStatus('active');
    }
  }, [company, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      logo,
      email,
      phone,
      address,
      industry,
      status,
    });
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={company ? 'Chỉnh Sửa Công Ty' : 'Thêm Công Ty Mới'}
      description="Quản lý thông tin đối tác kinh doanh trang sức"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-4 gap-3">
          <div className="col-span-1 space-y-1.5">
            <label className="text-xs font-semibold">Icon Logo</label>
            <Input value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="💎" required />
          </div>
          <div className="col-span-3 space-y-1.5">
            <label className="text-xs font-semibold">Tên Công Ty</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jemmia Diamond..." required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Email Doanh Nghiệp</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@company.vn" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Số Điện Thoại</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0838 353 333" required />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold">Địa Chỉ Trụ Sở</label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="72 Nguyễn Cư Trinh, Quận 1..." required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Lĩnh Vực Hàng Hóa</label>
            <Input value={industry} onChange={(e) => setIndustry(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Trạng Thái</label>
            <Select value={status} onChange={(e: any) => setStatus(e.target.value)}>
              <option value="active">Hoạt động</option>
              <option value="inactive">Tạm ngưng</option>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" variant="gradient">
            Lưu Công Ty
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
