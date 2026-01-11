import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, FileText, Download, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to={createPageUrl('Home')}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-bold">Back to Hub</span>
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Privacy Policy</h1>
              <p className="text-slate-600">Last updated: January 2025</p>
            </div>
          </div>

          <div className="space-y-8 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Commitment to Your Privacy</h2>
              <p className="leading-relaxed">
                AccessibilityPro is committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our services.
              </p>
            </section>

            <section className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-blue-600" />
                Data Security & Encryption
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>End-to-End Encryption:</strong> All sensitive data is encrypted on your device before transmission</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>AES-256 Encryption at Rest:</strong> Your data is encrypted in our databases using military-grade encryption</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>TLS 1.3 in Transit:</strong> All data transmission uses the latest secure protocols</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>AWS KMS Key Management:</strong> Encryption keys are managed securely using AWS Key Management Service</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Regular Security Audits:</strong> Quarterly third-party security audits and penetration testing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Continuous Vulnerability Scanning:</strong> Automated daily scanning for security vulnerabilities</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Personal Information:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Name and email address (for account creation)</li>
                    <li>Usage data and preferences</li>
                    <li>Device information and IP address</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Application Data:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Mood tracking entries (MoodSense)</li>
                    <li>Sign language practice progress (SignBridge)</li>
                    <li>Uploaded images and analysis results (VisionVerse)</li>
                    <li>Communication preferences (EmojiSpeak)</li>
                    <li>Relationship check-in data (Harmony)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">How We Use Your Data</h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Provide and improve our accessibility services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Generate AI-powered insights and recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Personalize your experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Send important service updates and notifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Comply with legal obligations</span>
                </li>
              </ul>
            </section>

            <section className="bg-green-50 rounded-2xl p-6 border border-green-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Global Privacy Compliance</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
                    🇪🇺 GDPR Compliance (European Union)
                  </h3>
                  <p className="text-sm">Full compliance with the General Data Protection Regulation, including rights to access, rectification, erasure, and data portability.</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
                    🇺🇸 CCPA Compliance (California)
                  </h3>
                  <p className="text-sm">Compliance with the California Consumer Privacy Act, including rights to know, delete, and opt-out of data sale.</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
                    🇦🇺 Australian Privacy Act Compliance
                  </h3>
                  <p className="text-sm">Full compliance with Australian Privacy Principles (APPs) for data collection, use, and disclosure.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Rights</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white border-2 border-slate-200 rounded-xl p-4">
                  <Eye className="w-6 h-6 text-blue-600 mb-2" />
                  <h3 className="font-bold text-slate-900 mb-1">Right to Access</h3>
                  <p className="text-sm text-slate-600">Request a copy of all your personal data</p>
                </div>
                <div className="bg-white border-2 border-slate-200 rounded-xl p-4">
                  <Download className="w-6 h-6 text-green-600 mb-2" />
                  <h3 className="font-bold text-slate-900 mb-1">Data Portability</h3>
                  <p className="text-sm text-slate-600">Export your data in a machine-readable format</p>
                </div>
                <div className="bg-white border-2 border-slate-200 rounded-xl p-4">
                  <FileText className="w-6 h-6 text-purple-600 mb-2" />
                  <h3 className="font-bold text-slate-900 mb-1">Right to Rectification</h3>
                  <p className="text-sm text-slate-600">Correct inaccurate personal information</p>
                </div>
                <div className="bg-white border-2 border-slate-200 rounded-xl p-4">
                  <Trash2 className="w-6 h-6 text-red-600 mb-2" />
                  <h3 className="font-bold text-slate-900 mb-1">Right to Erasure</h3>
                  <p className="text-sm text-slate-600">Request deletion of your personal data</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Retention & Deletion</h2>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <ul className="space-y-3">
                  <li><strong>Active Accounts:</strong> Data retained as long as your account is active</li>
                  <li><strong>Inactive Accounts:</strong> Data retained for 2 years after last login, then automatically deleted</li>
                  <li><strong>Deleted Accounts:</strong> All personal data securely deleted within 30 days of account deletion request</li>
                  <li><strong>Backup Data:</strong> Removed from backups within 90 days of deletion</li>
                  <li><strong>Legal Requirements:</strong> Some data may be retained longer if required by law</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Audit Logging & Transparency</h2>
              <p className="mb-3">
                We maintain comprehensive audit logs of all data access and modifications:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Who accessed your data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>When the access occurred</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>What actions were performed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Reason for access (system, support, or user-initiated)</span>
                </li>
              </ul>
              <p className="mt-3 text-sm text-slate-600">
                You can request your audit log at any time from your Security Settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Sharing & Third Parties</h2>
              <p className="mb-3">
                We do not sell your personal data. We only share data with:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span><strong>Service Providers:</strong> Cloud hosting (AWS), analytics (anonymized)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span><strong>AI Providers:</strong> OpenAI for AI features (data encrypted and anonymized)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span><strong>Legal Requirements:</strong> When required by law or to protect rights</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
              <p className="mb-4">
                For privacy concerns, data requests, or questions about this policy:
              </p>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <p><strong>Email:</strong> privacy@accessibilitypro.com</p>
                <p><strong>Data Protection Officer:</strong> dpo@accessibilitypro.com</p>
                <p><strong>Response Time:</strong> Within 30 days (GDPR/CCPA requirement)</p>
              </div>
            </section>

            <section className="border-t-2 border-slate-200 pt-6">
              <p className="text-sm text-slate-500">
                This policy was last updated on January 1, 2025. We may update this policy periodically. 
                Material changes will be notified via email and in-app notification.
              </p>
            </section>
          </div>

          <div className="mt-8 flex gap-4">
            <Link to={createPageUrl('SecuritySettings')} className="flex-1">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white h-14">
                <ShieldCheck className="w-5 h-5 mr-2" />
                <span className="font-bold">Manage Your Privacy Settings</span>
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}