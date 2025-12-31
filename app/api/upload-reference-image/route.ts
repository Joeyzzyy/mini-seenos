import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // Use service role to allow uploads
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          persistSession: false,
        }
      }
    );

    // Try to get the current user
    const authHeader = request.headers.get('Authorization');
    let userId = 'public';
    
    if (authHeader) {
      const { data: { user } } = await createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: { headers: { Authorization: authHeader } }
        }
      ).auth.getUser();
      
      if (user) userId = user.id;
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const conversationId = formData.get('conversationId') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExt = file.name.split('.').pop();
    const filename = `reference-images/${userId}/${timestamp}-${randomString}.${fileExt}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage (files bucket)
    const { data, error: uploadError } = await supabase.storage
      .from('files')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { 
          error: 'Failed to upload file',
          details: uploadError.message 
        },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('files')
      .getPublicUrl(filename);

    // Save file record to database
    const fileSize = buffer.length;
    const { data: fileRecord, error: dbError } = await supabase
      .from('files')
      .insert({
        user_id: userId,
        conversation_id: conversationId,
        filename: file.name,
        original_filename: file.name,
        file_type: 'image',
        mime_type: file.type,
        file_size: fileSize,
        storage_path: filename,
        public_url: publicUrl,
        metadata: {
          isReferenceImage: true,
          uploadedAt: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error (file still uploaded to storage):', dbError);
      // Still return success since the file is uploaded to storage
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: file.name,
      fileId: fileRecord?.id,
    });

  } catch (error) {
    console.error('Reference image upload error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

