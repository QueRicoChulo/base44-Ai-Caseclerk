/**
 * Core integration functions for CaseClerk AI.
 * Handles file uploads, AI processing, and external service integrations.
 * Provides unified interface for document processing and AI-powered features.
 */

import { apiClient, base44Api } from '@/utils/api';

export interface UploadFileOptions {
  caseId?: string;
  documentType?: string;
  onProgress?: (progress: number) => void;
  onStatusChange?: (status: string) => void;
}

export interface UploadFileResult {
  id: string;
  filename: string;
  url: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number;
}

export interface ExtractedData {
  text: string;
  metadata: {
    pages: number;
    wordCount: number;
    language: string;
    documentType: string;
  };
  entities: {
    names: string[];
    dates: string[];
    locations: string[];
    organizations: string[];
  };
  summary: string;
}

export interface LLMResponse {
  response: string;
  confidence: number;
  tokens_used: number;
  model: string;
}

/**
 * Upload file to the server with progress tracking and AI processing
 */
export async function UploadFile(
  file: File,
  options: UploadFileOptions = {}
): Promise<UploadFileResult> {
  try {
    const { caseId, documentType, onProgress, onStatusChange } = options;

    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 50MB limit');
    }

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not supported');
    }

    onStatusChange?.('uploading');

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    if (caseId) formData.append('case_id', caseId);
    if (documentType) formData.append('document_type', documentType);

    // Upload file with progress tracking
    const response = await apiClient.post('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress?.(progress);
        }
      },
    });

    const uploadResult: UploadFileResult = {
      id: response.data.id,
      filename: response.data.original_name,
      url: response.data.file_url,
      status: response.data.status || 'completed',
      progress: 100
    };

    onStatusChange?.('processing');

    // Trigger AI processing if document type supports it
    if (['pdf', 'doc', 'docx', 'txt'].includes(getFileExtension(file.name))) {
      try {
        await apiClient.post(`/api/documents/${uploadResult.id}/process`);
        onStatusChange?.('completed');
      } catch (processingError) {
        console.warn('AI processing failed:', processingError);
        // Don't fail the upload if AI processing fails
      }
    }

    return uploadResult;

  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
}

/**
 * Extract data from uploaded file using AI processing
 */
export async function ExtractDataFromUploadedFile(
  fileId: string,
  options: {
    includeText?: boolean;
    includeEntities?: boolean;
    includeSummary?: boolean;
    language?: string;
  } = {}
): Promise<ExtractedData> {
  try {
    const {
      includeText = true,
      includeEntities = true,
      includeSummary = true,
      language = 'en'
    } = options;

    // Request data extraction
    const response = await apiClient.post(`/api/documents/${fileId}/extract`, {
      include_text: includeText,
      include_entities: includeEntities,
      include_summary: includeSummary,
      language
    });

    const extractedData: ExtractedData = {
      text: response.data.extracted_text || '',
      metadata: {
        pages: response.data.metadata?.pages || 0,
        wordCount: response.data.metadata?.word_count || 0,
        language: response.data.metadata?.language || language,
        documentType: response.data.metadata?.document_type || 'unknown'
      },
      entities: {
        names: response.data.entities?.names || [],
        dates: response.data.entities?.dates || [],
        locations: response.data.entities?.locations || [],
        organizations: response.data.entities?.organizations || []
      },
      summary: response.data.ai_summary || ''
    };

    return extractedData;

  } catch (error) {
    console.error('Data extraction error:', error);
    throw new Error('Failed to extract data from file');
  }
}

/**
 * Invoke Large Language Model for AI-powered analysis
 */
export async function InvokeLLM(
  prompt: string,
  options: {
    model?: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' | 'claude-2';
    maxTokens?: number;
    temperature?: number;
    context?: string;
    systemPrompt?: string;
  } = {}
): Promise<LLMResponse> {
  try {
    const {
      model = 'gpt-3.5-turbo',
      maxTokens = 1000,
      temperature = 0.7,
      context,
      systemPrompt
    } = options;

    // Validate prompt
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt is required');
    }

    // Prepare request payload
    const payload = {
      prompt: prompt.trim(),
      model,
      max_tokens: maxTokens,
      temperature,
      context,
      system_prompt: systemPrompt
    };

    // Make API request
    const response = await apiClient.post('/api/ai/invoke', payload);

    const llmResponse: LLMResponse = {
      response: response.data.response || '',
      confidence: response.data.confidence || 0,
      tokens_used: response.data.tokens_used || 0,
      model: response.data.model || model
    };

    return llmResponse;

  } catch (error) {
    console.error('LLM invocation error:', error);
    throw new Error('Failed to get AI response');
  }
}

/**
 * Process document with AI for legal analysis
 */
export async function ProcessLegalDocument(
  fileId: string,
  analysisType: 'summary' | 'key_points' | 'risk_analysis' | 'compliance_check' = 'summary'
): Promise<{
  analysis: string;
  keyPoints: string[];
  risks: string[];
  recommendations: string[];
  confidence: number;
}> {
  try {
    const response = await apiClient.post(`/api/documents/${fileId}/legal-analysis`, {
      analysis_type: analysisType
    });

    return {
      analysis: response.data.analysis || '',
      keyPoints: response.data.key_points || [],
      risks: response.data.risks || [],
      recommendations: response.data.recommendations || [],
      confidence: response.data.confidence || 0
    };

  } catch (error) {
    console.error('Legal document processing error:', error);
    throw new Error('Failed to process legal document');
  }
}

/**
 * Generate legal document using AI
 */
export async function GenerateLegalDocument(
  templateType: string,
  parameters: Record<string, any>
): Promise<{
  content: string;
  filename: string;
  format: 'docx' | 'pdf';
}> {
  try {
    const response = await apiClient.post('/api/ai/generate-document', {
      template_type: templateType,
      parameters
    });

    return {
      content: response.data.content,
      filename: response.data.filename,
      format: response.data.format || 'docx'
    };

  } catch (error) {
    console.error('Document generation error:', error);
    throw new Error('Failed to generate legal document');
  }
}

/**
 * Transcribe audio file to text
 */
export async function TranscribeAudio(
  audioFile: File,
  options: {
    language?: string;
    speakerDiarization?: boolean;
    timestamps?: boolean;
  } = {}
): Promise<{
  transcript: string;
  speakers?: Array<{
    speaker: string;
    text: string;
    timestamp: string;
  }>;
  confidence: number;
}> {
  try {
    const { language = 'en', speakerDiarization = false, timestamps = false } = options;

    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('language', language);
    formData.append('speaker_diarization', speakerDiarization.toString());
    formData.append('timestamps', timestamps.toString());

    const response = await apiClient.post('/api/ai/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      transcript: response.data.transcript,
      speakers: response.data.speakers,
      confidence: response.data.confidence || 0
    };

  } catch (error) {
    console.error('Audio transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
}

/**
 * Utility functions
 */

function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
}

/**
 * Check if file type is supported for AI processing
 */
export function isProcessableFile(filename: string): boolean {
  const processableExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
  const extension = getFileExtension(filename);
  return processableExtensions.includes(extension);
}

/**
 * Get estimated processing time based on file size
 */
export function getEstimatedProcessingTime(fileSize: number): number {
  // Rough estimate: 1MB = 30 seconds processing time
  const baseSizeInMB = fileSize / (1024 * 1024);
  return Math.max(30, Math.round(baseSizeInMB * 30));
}

/**
 * Validate file for upload
 */
export function validateFileForUpload(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file size (50MB limit)
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 50MB limit' };
  }

  // Check file type
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif'
  ];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not supported' };
  }

  return { valid: true };
}