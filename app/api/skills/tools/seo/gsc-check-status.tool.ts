import { tool } from 'ai';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

export const gsc_check_status = tool({
  description: 'Check if Google Search Console (GSC) is authorized and list the authorized sites. Use this as the first step for any GSC-related task.',
  parameters: z.object({
    userId: z.string().describe('The ID of the current user'),
    conversationId: z.string().optional().describe('The ID of the current conversation'),
  }),
  execute: async ({ userId, conversationId }) => {
    const authUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/gsc/authorize?userId=${userId}${conversationId ? `&conversationId=${conversationId}` : ''}`;
    
    try {
      const { data: integration, error } = await supabase
        .from('gsc_integrations')
        .select('authorized_sites')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('[GSC Status Tool] Database error (expected if table not created):', error);
        return {
          isAuthorized: false,
          message: 'GSC system is ready but database table check failed. Please ensure the gsc_integrations table exists.',
          authUrl,
          instructions: 'Tell the user they need to authorize GSC by clicking the link provided below. If they have already done so and see this, the developer needs to run the SQL migration.'
        };
      }

      if (!integration) {
        return {
          isAuthorized: false,
          message: 'Google Search Console is not authorized for this account.',
          authUrl,
          instructions: 'Clearly display the authorization link/button to the user: ' + authUrl
        };
      }

      return {
        isAuthorized: true,
        sites: integration.authorized_sites || [],
        message: integration.authorized_sites?.length 
          ? `GSC is authorized. Found ${integration.authorized_sites.length} sites.`
          : 'GSC is authorized but no sites were found.'
      };
    } catch (error: any) {
      return { 
        isAuthorized: false, 
        error: error.message,
        authUrl,
        instructions: 'Database might be missing. Provide the auth link anyway: ' + authUrl
      };
    }
  },
});

(gsc_check_status as any).metadata = {
  name: 'GSC Status Checker',
  provider: 'Google'
};

