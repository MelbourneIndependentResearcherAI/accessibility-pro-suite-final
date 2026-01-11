import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Link as LinkIcon, Upload, FileText, AlertCircle, CheckCircle, AlertTriangle, Code, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InteractiveTutorial from '@/components/tutorials/InteractiveTutorial';

const tutorialSteps = [
  {
    title: 'Accessibility Analysis',
    description: 'Check websites and documents for WCAG compliance, ADA standards, and accessibility issues',
    icon: <AlertCircle className="w-8 h-8 text-white" />
  },
  {
    title: 'Detailed Reports',
    description: 'Get comprehensive reports with severity levels, specific issues, and actionable recommendations',
    icon: <FileText className="w-8 h-8 text-white" />
  },
  {
    title: 'Code Fixes',
    description: 'Receive ready-to-use code snippets and specific implementation guidance for each issue',
    icon: <Code className="w-8 h-8 text-white" />
  }
];

export default function AccessibilityAnalyzer() {
  const [showApp, setShowApp] = useState(false);
  const [url, setUrl] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  const analyzeUrl = async () => {
    if (!url) return;
    
    setIsAnalyzing(true);
    setReport(null);
    
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this website URL for accessibility compliance: ${url}

Provide a comprehensive accessibility audit covering:
1. WCAG 2.1 compliance (Level A, AA, AAA)
2. ADA compliance issues
3. Keyboard navigation
4. Screen reader compatibility
5. Color contrast ratios
6. Alt text for images
7. ARIA attributes
8. Semantic HTML
9. Form labels and accessibility
10. Focus management

For EACH issue found, provide:
- Severity (Critical, High, Medium, Low)
- Specific location/element
- Current code (if applicable)
- Fixed code snippet
- WCAG guideline reference

Be thorough and technical.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            overall_score: { type: "number", description: "Score out of 100" },
            compliance_level: { type: "string", enum: ["A", "AA", "AAA", "Non-compliant"] },
            summary: { type: "string" },
            critical_issues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  location: { type: "string" },
                  current_code: { type: "string" },
                  fixed_code: { type: "string" },
                  wcag_reference: { type: "string" }
                }
              }
            },
            high_issues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  location: { type: "string" },
                  current_code: { type: "string" },
                  fixed_code: { type: "string" },
                  wcag_reference: { type: "string" }
                }
              }
            },
            medium_issues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  location: { type: "string" },
                  current_code: { type: "string" },
                  fixed_code: { type: "string" },
                  wcag_reference: { type: "string" }
                }
              }
            },
            recommendations: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      setReport(result);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeCode = async () => {
    if (!htmlCode) return;
    
    setIsAnalyzing(true);
    setReport(null);
    
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this HTML/code for accessibility issues:

\`\`\`html
${htmlCode}
\`\`\`

Provide a detailed accessibility audit including:
- Missing alt text
- Poor color contrast
- Missing ARIA labels
- Keyboard navigation issues
- Semantic HTML problems
- Form accessibility
- Focus management

For each issue, provide the current code and corrected version with explanations.`,
        response_json_schema: {
          type: "object",
          properties: {
            overall_score: { type: "number" },
            compliance_level: { type: "string" },
            summary: { type: "string" },
            critical_issues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  location: { type: "string" },
                  current_code: { type: "string" },
                  fixed_code: { type: "string" },
                  wcag_reference: { type: "string" }
                }
              }
            },
            high_issues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  location: { type: "string" },
                  current_code: { type: "string" },
                  fixed_code: { type: "string" },
                  wcag_reference: { type: "string" }
                }
              }
            },
            medium_issues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  location: { type: "string" },
                  current_code: { type: "string" },
                  fixed_code: { type: "string" },
                  wcag_reference: { type: "string" }
                }
              }
            },
            recommendations: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      setReport(result);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeDocument = async () => {
    if (!uploadedFile) return;
    
    setIsAnalyzing(true);
    setReport(null);
    
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: uploadedFile });
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this document for accessibility compliance. Check for:
- Proper heading structure
- Alternative text for images
- Color contrast
- Reading order
- Table accessibility
- Link descriptions
- Document structure

Provide detailed findings with specific fixes.`,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            overall_score: { type: "number" },
            compliance_level: { type: "string" },
            summary: { type: "string" },
            critical_issues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  location: { type: "string" },
                  current_code: { type: "string" },
                  fixed_code: { type: "string" },
                  wcag_reference: { type: "string" }
                }
              }
            },
            high_issues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  location: { type: "string" },
                  current_code: { type: "string" },
                  fixed_code: { type: "string" },
                  wcag_reference: { type: "string" }
                }
              }
            },
            medium_issues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  location: { type: "string" },
                  current_code: { type: "string" },
                  fixed_code: { type: "string" },
                  wcag_reference: { type: "string" }
                }
              }
            },
            recommendations: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      setReport(result);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  const renderIssue = (issue, severity) => (
    <Card key={issue.title} className="bg-slate-900 border-slate-800">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-white text-lg mb-2">{issue.title}</CardTitle>
            <p className="text-slate-400 text-sm">{issue.description}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(severity)}`}>
            {severity.toUpperCase()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {issue.location && (
          <div>
            <p className="text-slate-500 text-xs font-semibold mb-1">LOCATION</p>
            <p className="text-slate-300 text-sm">{issue.location}</p>
          </div>
        )}
        
        {issue.current_code && (
          <div>
            <p className="text-slate-500 text-xs font-semibold mb-2">CURRENT CODE</p>
            <pre className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-red-400 overflow-x-auto">
              <code>{issue.current_code}</code>
            </pre>
          </div>
        )}
        
        {issue.fixed_code && (
          <div>
            <p className="text-slate-500 text-xs font-semibold mb-2">FIXED CODE</p>
            <pre className="bg-slate-950 border border-green-900/30 rounded-lg p-3 text-xs text-green-400 overflow-x-auto">
              <code>{issue.fixed_code}</code>
            </pre>
          </div>
        )}
        
        {issue.wcag_reference && (
          <div>
            <p className="text-slate-500 text-xs font-semibold mb-1">WCAG REFERENCE</p>
            <p className="text-blue-400 text-sm">{issue.wcag_reference}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (!showApp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-4xl mx-auto">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" className="mb-8 text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hub
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Accessibility Analyzer
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              AI-powered accessibility compliance expert that analyzes websites, code, and documents for WCAG, ADA, and Section 508 compliance
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">WCAG Compliance</h3>
              <p className="text-white/70">Comprehensive analysis for WCAG 2.1 Level A, AA, and AAA standards</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Detailed Reports</h3>
              <p className="text-white/70">Get severity levels, specific issues, and actionable recommendations</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Code Fixes</h3>
              <p className="text-white/70">Ready-to-use code snippets with implementation guidance</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <LinkIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">URL Analysis</h3>
              <p className="text-white/70">Analyze live websites for accessibility issues</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Document Scanning</h3>
              <p className="text-white/70">Upload PDFs, DOCX, or HTML files for compliance checks</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">ADA Standards</h3>
              <p className="text-white/70">Verify compliance with American Disabilities Act requirements</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <Button
              size="lg"
              onClick={() => setShowApp(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-6 text-xl font-bold rounded-xl shadow-2xl h-16"
            >
              <span className="font-bold">Start Analysis</span>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <InteractiveTutorial steps={tutorialSteps} appName="AccessibilityAnalyzer" />
      
      <div className="max-w-6xl mx-auto">
        <Link to={createPageUrl('Home')}>
          <Button variant="ghost" className="mb-6 text-white hover:bg-slate-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hub
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">Accessibility Analyzer</h1>

        <Tabs defaultValue="url" className="mb-8">
          <TabsList className="grid grid-cols-3 bg-slate-900 mb-6 p-1.5 rounded-xl gap-1">
            <TabsTrigger value="url" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300 font-bold py-3 rounded-lg">
              <LinkIcon className="w-4 h-4 mr-2" />
              <span className="font-bold">Website URL</span>
            </TabsTrigger>
            <TabsTrigger value="code" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300 font-bold py-3 rounded-lg">
              <Code className="w-4 h-4 mr-2" />
              <span className="font-bold">HTML Code</span>
            </TabsTrigger>
            <TabsTrigger value="document" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300 font-bold py-3 rounded-lg">
              <FileText className="w-4 h-4 mr-2" />
              <span className="font-bold">Document</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-white font-medium mb-2 block">Website URL</label>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <Button
                    onClick={analyzeUrl}
                    disabled={!url || isAnalyzing}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-lg font-bold"
                  >
                    {isAnalyzing ? (
                      <>
                        <Zap className="w-5 h-5 mr-2 animate-pulse" />
                        <span className="font-bold">Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        <span className="font-bold">Analyze Website</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-white font-medium mb-2 block">HTML/Code</label>
                    <Textarea
                      placeholder="Paste your HTML code here..."
                      value={htmlCode}
                      onChange={(e) => setHtmlCode(e.target.value)}
                      rows={10}
                      className="bg-slate-800 border-slate-700 text-white font-mono text-sm"
                    />
                  </div>
                  <Button
                    onClick={analyzeCode}
                    disabled={!htmlCode || isAnalyzing}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-lg font-bold"
                  >
                    {isAnalyzing ? (
                      <>
                        <Zap className="w-5 h-5 mr-2 animate-pulse" />
                        <span className="font-bold">Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        <span className="font-bold">Analyze Code</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="document">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-white font-medium mb-2 block">Upload Document</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.html"
                      onChange={(e) => setUploadedFile(e.target.files[0])}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="w-full border-slate-700 text-white hover:bg-slate-800 h-12 font-bold"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      <span className="font-bold">{uploadedFile ? uploadedFile.name : 'Choose File'}</span>
                    </Button>
                  </div>
                  <Button
                    onClick={analyzeDocument}
                    disabled={!uploadedFile || isAnalyzing}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-lg font-bold"
                  >
                    {isAnalyzing ? (
                      <>
                        <Zap className="w-5 h-5 mr-2 animate-pulse" />
                        <span className="font-bold">Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        <span className="font-bold">Analyze Document</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AnimatePresence>
          {report && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-indigo-800">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white mb-2">{report.overall_score}/100</div>
                      <div className="text-slate-400">Overall Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-indigo-400 mb-2">{report.compliance_level}</div>
                      <div className="text-slate-400">WCAG Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-400 mb-2">
                        {(report.critical_issues?.length || 0) + (report.high_issues?.length || 0) + (report.medium_issues?.length || 0)}
                      </div>
                      <div className="text-slate-400">Issues Found</div>
                    </div>
                  </div>
                  <p className="text-white text-center text-lg">{report.summary}</p>
                </CardContent>
              </Card>

              {report.critical_issues?.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    <h2 className="text-2xl font-bold text-white">Critical Issues</h2>
                  </div>
                  <div className="space-y-4">
                    {report.critical_issues.map(issue => renderIssue(issue, 'critical'))}
                  </div>
                </div>
              )}

              {report.high_issues?.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-orange-500" />
                    <h2 className="text-2xl font-bold text-white">High Priority Issues</h2>
                  </div>
                  <div className="space-y-4">
                    {report.high_issues.map(issue => renderIssue(issue, 'high'))}
                  </div>
                </div>
              )}

              {report.medium_issues?.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-yellow-500" />
                    <h2 className="text-2xl font-bold text-white">Medium Priority Issues</h2>
                  </div>
                  <div className="space-y-4">
                    {report.medium_issues.map(issue => renderIssue(issue, 'medium'))}
                  </div>
                </div>
              )}

              {report.recommendations?.length > 0 && (
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {report.recommendations.map((rec, i) => (
                        <li key={i} className="text-slate-300 flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}