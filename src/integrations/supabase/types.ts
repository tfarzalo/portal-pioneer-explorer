export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          entity_id: string
          entity_type: string
          id: string
          is_read: boolean | null
          notification_type: string | null
          priority: string | null
          read_at: string | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          entity_id: string
          entity_type: string
          id?: string
          is_read?: boolean | null
          notification_type?: string | null
          priority?: string | null
          read_at?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string
          entity_type?: string
          id?: string
          is_read?: boolean | null
          notification_type?: string | null
          priority?: string | null
          read_at?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      extra_charges: {
        Row: {
          amount: number
          charge_type: string
          created_at: string | null
          description: string | null
          id: string
          job_id: string | null
          location: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          charge_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          job_id?: string | null
          location: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          charge_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          job_id?: string | null
          location?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "extra_charges_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      file_associations: {
        Row: {
          association_type: string
          created_at: string | null
          created_by: string | null
          entity_id: string
          entity_type: string
          file_id: string | null
          id: string
        }
        Insert: {
          association_type: string
          created_at?: string | null
          created_by?: string | null
          entity_id: string
          entity_type: string
          file_id?: string | null
          id?: string
        }
        Update: {
          association_type?: string
          created_at?: string | null
          created_by?: string | null
          entity_id?: string
          entity_type?: string
          file_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_associations_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
        ]
      }
      file_thumbnails: {
        Row: {
          created_at: string | null
          file_id: string | null
          height: number
          id: string
          size: string
          storage_path: string
          width: number
        }
        Insert: {
          created_at?: string | null
          file_id?: string | null
          height: number
          id?: string
          size: string
          storage_path: string
          width: number
        }
        Update: {
          created_at?: string | null
          file_id?: string | null
          height?: number
          id?: string
          size?: string
          storage_path?: string
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "file_thumbnails_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          category: Database["public"]["Enums"]["file_category"]
          created_at: string | null
          delete_reason: string | null
          deleted_at: string | null
          deleted_by: string | null
          file_type: Database["public"]["Enums"]["file_type"]
          filename: string
          id: string
          is_deleted: boolean | null
          metadata: Json | null
          mime_type: string
          original_filename: string
          size: number
          storage_path: string
          updated_at: string | null
          uploaded_by: string | null
          version: number | null
        }
        Insert: {
          category: Database["public"]["Enums"]["file_category"]
          created_at?: string | null
          delete_reason?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          file_type: Database["public"]["Enums"]["file_type"]
          filename: string
          id?: string
          is_deleted?: boolean | null
          metadata?: Json | null
          mime_type: string
          original_filename: string
          size: number
          storage_path: string
          updated_at?: string | null
          uploaded_by?: string | null
          version?: number | null
        }
        Update: {
          category?: Database["public"]["Enums"]["file_category"]
          created_at?: string | null
          delete_reason?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          file_type?: Database["public"]["Enums"]["file_type"]
          filename?: string
          id?: string
          is_deleted?: boolean | null
          metadata?: Json | null
          mime_type?: string
          original_filename?: string
          size?: number
          storage_path?: string
          updated_at?: string | null
          uploaded_by?: string | null
          version?: number | null
        }
        Relationships: []
      }
      job_phase_history: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          id: string
          job_id: string | null
          new_phase: Database["public"]["Enums"]["job_phase"]
          old_phase: Database["public"]["Enums"]["job_phase"] | null
          reason: string | null
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          job_id?: string | null
          new_phase: Database["public"]["Enums"]["job_phase"]
          old_phase?: Database["public"]["Enums"]["job_phase"] | null
          reason?: string | null
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          job_id?: string | null
          new_phase?: Database["public"]["Enums"]["job_phase"]
          old_phase?: Database["public"]["Enums"]["job_phase"] | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_phase_history_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_requests: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          job_type: Database["public"]["Enums"]["job_type"]
          phase: Database["public"]["Enums"]["job_phase"] | null
          property_id: string | null
          requested_by: string | null
          scheduled_date: string | null
          unit_number: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          job_type: Database["public"]["Enums"]["job_type"]
          phase?: Database["public"]["Enums"]["job_phase"] | null
          property_id?: string | null
          requested_by?: string | null
          scheduled_date?: string | null
          unit_number: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          job_type?: Database["public"]["Enums"]["job_type"]
          phase?: Database["public"]["Enums"]["job_phase"] | null
          property_id?: string | null
          requested_by?: string | null
          scheduled_date?: string | null
          unit_number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          assigned_to: string | null
          base_amount: number | null
          cancelled_at: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          id: string
          job_number: string
          job_type: Database["public"]["Enums"]["job_type"]
          phase: Database["public"]["Enums"]["job_phase"]
          property_id: string | null
          scheduled_date: string | null
          submitted_by: string | null
          total_amount: number | null
          unit_number: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          base_amount?: number | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          job_number: string
          job_type: Database["public"]["Enums"]["job_type"]
          phase?: Database["public"]["Enums"]["job_phase"]
          property_id?: string | null
          scheduled_date?: string | null
          submitted_by?: string | null
          total_amount?: number | null
          unit_number: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          base_amount?: number | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          job_number?: string
          job_type?: Database["public"]["Enums"]["job_type"]
          phase?: Database["public"]["Enums"]["job_phase"]
          property_id?: string | null
          scheduled_date?: string | null
          submitted_by?: string | null
          total_amount?: number | null
          unit_number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_submitted_by_profiles_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      paint_details: {
        Row: {
          accent_wall_count: number | null
          ceiling_spotting: string | null
          ceilings: string | null
          created_at: string | null
          doors: string | null
          has_accent_wall: boolean | null
          id: string
          is_custom_color: boolean | null
          job_id: string | null
          paint_ceilings: boolean | null
          paint_doors: boolean | null
          paint_trim: boolean | null
          paint_walls: boolean | null
          trim: string | null
          updated_at: string | null
          wall_notes: string | null
          walls: string | null
        }
        Insert: {
          accent_wall_count?: number | null
          ceiling_spotting?: string | null
          ceilings?: string | null
          created_at?: string | null
          doors?: string | null
          has_accent_wall?: boolean | null
          id?: string
          is_custom_color?: boolean | null
          job_id?: string | null
          paint_ceilings?: boolean | null
          paint_doors?: boolean | null
          paint_trim?: boolean | null
          paint_walls?: boolean | null
          trim?: string | null
          updated_at?: string | null
          wall_notes?: string | null
          walls?: string | null
        }
        Update: {
          accent_wall_count?: number | null
          ceiling_spotting?: string | null
          ceilings?: string | null
          created_at?: string | null
          doors?: string | null
          has_accent_wall?: boolean | null
          id?: string
          is_custom_color?: boolean | null
          job_id?: string | null
          paint_ceilings?: boolean | null
          paint_doors?: boolean | null
          paint_trim?: boolean | null
          paint_walls?: boolean | null
          trim?: string | null
          updated_at?: string | null
          wall_notes?: string | null
          walls?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paint_details_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          location: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          location?: string | null
          phone?: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          accounts_payable_email: string | null
          accounts_payable_name: string | null
          accounts_payable_phone: string | null
          address: string
          assigned_users: string | null
          billing_data: string | null
          city: string
          colors_ceilings: string | null
          colors_kitchen_bathroom: string | null
          colors_regular_apartment: string | null
          colors_trim_base_doors: string | null
          colors_walls: string | null
          community_manager_email: string | null
          community_manager_name: string | null
          community_manager_phone: string | null
          compliance_bid_approved: string | null
          compliance_coi_address: string | null
          compliance_create_sub_prop_info_port: string | null
          compliance_email_bookkeeper_team_notify: string | null
          compliance_email_prop_sched_vehicle: string | null
          compliance_email_upload_coi_w9_comp_software: string | null
          compliance_invoice_delivery_system: string | null
          compliance_jg_compliance: string | null
          compliance_jg_compliance_approval: string | null
          compliance_po_needed: string | null
          compliance_w9_created: string | null
          created_at: string | null
          created_by: string | null
          extra_charges_notes: string | null
          group_id: string | null
          id: string
          invoices: string | null
          jobs: string | null
          maintenance_supervisor_email: string | null
          maintenance_supervisor_name: string | null
          maintenance_supervisor_phone: string | null
          name: string
          occupied_regular_paint_fees: string | null
          paint_location: string | null
          point_of_contact: string | null
          primary_contact: string | null
          primary_contact_name: string | null
          primary_contact_phone: string | null
          primary_contact_role: string | null
          property_address: string | null
          property_address_2: string | null
          property_address_full: string | null
          property_billing_notes: string | null
          property_city: string | null
          property_grade: string | null
          property_management_group: string | null
          property_name: string | null
          property_notes_and_callbacks: string | null
          property_phone: string | null
          property_region: string | null
          property_site_plan: string | null
          property_state: string | null
          property_supplies_paint: string | null
          property_unit_layout: string | null
          property_zip: string | null
          quickbooks_qb: string | null
          state: string
          status: Database["public"]["Enums"]["property_status"] | null
          subcontractor_a: string | null
          subcontractor_b: string | null
          total_units: number | null
          unique_id: string | null
          updated_at: string | null
          updated_by: string | null
          zip: string
        }
        Insert: {
          accounts_payable_email?: string | null
          accounts_payable_name?: string | null
          accounts_payable_phone?: string | null
          address: string
          assigned_users?: string | null
          billing_data?: string | null
          city: string
          colors_ceilings?: string | null
          colors_kitchen_bathroom?: string | null
          colors_regular_apartment?: string | null
          colors_trim_base_doors?: string | null
          colors_walls?: string | null
          community_manager_email?: string | null
          community_manager_name?: string | null
          community_manager_phone?: string | null
          compliance_bid_approved?: string | null
          compliance_coi_address?: string | null
          compliance_create_sub_prop_info_port?: string | null
          compliance_email_bookkeeper_team_notify?: string | null
          compliance_email_prop_sched_vehicle?: string | null
          compliance_email_upload_coi_w9_comp_software?: string | null
          compliance_invoice_delivery_system?: string | null
          compliance_jg_compliance?: string | null
          compliance_jg_compliance_approval?: string | null
          compliance_po_needed?: string | null
          compliance_w9_created?: string | null
          created_at?: string | null
          created_by?: string | null
          extra_charges_notes?: string | null
          group_id?: string | null
          id?: string
          invoices?: string | null
          jobs?: string | null
          maintenance_supervisor_email?: string | null
          maintenance_supervisor_name?: string | null
          maintenance_supervisor_phone?: string | null
          name: string
          occupied_regular_paint_fees?: string | null
          paint_location?: string | null
          point_of_contact?: string | null
          primary_contact?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          primary_contact_role?: string | null
          property_address?: string | null
          property_address_2?: string | null
          property_address_full?: string | null
          property_billing_notes?: string | null
          property_city?: string | null
          property_grade?: string | null
          property_management_group?: string | null
          property_name?: string | null
          property_notes_and_callbacks?: string | null
          property_phone?: string | null
          property_region?: string | null
          property_site_plan?: string | null
          property_state?: string | null
          property_supplies_paint?: string | null
          property_unit_layout?: string | null
          property_zip?: string | null
          quickbooks_qb?: string | null
          state: string
          status?: Database["public"]["Enums"]["property_status"] | null
          subcontractor_a?: string | null
          subcontractor_b?: string | null
          total_units?: number | null
          unique_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          zip: string
        }
        Update: {
          accounts_payable_email?: string | null
          accounts_payable_name?: string | null
          accounts_payable_phone?: string | null
          address?: string
          assigned_users?: string | null
          billing_data?: string | null
          city?: string
          colors_ceilings?: string | null
          colors_kitchen_bathroom?: string | null
          colors_regular_apartment?: string | null
          colors_trim_base_doors?: string | null
          colors_walls?: string | null
          community_manager_email?: string | null
          community_manager_name?: string | null
          community_manager_phone?: string | null
          compliance_bid_approved?: string | null
          compliance_coi_address?: string | null
          compliance_create_sub_prop_info_port?: string | null
          compliance_email_bookkeeper_team_notify?: string | null
          compliance_email_prop_sched_vehicle?: string | null
          compliance_email_upload_coi_w9_comp_software?: string | null
          compliance_invoice_delivery_system?: string | null
          compliance_jg_compliance?: string | null
          compliance_jg_compliance_approval?: string | null
          compliance_po_needed?: string | null
          compliance_w9_created?: string | null
          created_at?: string | null
          created_by?: string | null
          extra_charges_notes?: string | null
          group_id?: string | null
          id?: string
          invoices?: string | null
          jobs?: string | null
          maintenance_supervisor_email?: string | null
          maintenance_supervisor_name?: string | null
          maintenance_supervisor_phone?: string | null
          name?: string
          occupied_regular_paint_fees?: string | null
          paint_location?: string | null
          point_of_contact?: string | null
          primary_contact?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          primary_contact_role?: string | null
          property_address?: string | null
          property_address_2?: string | null
          property_address_full?: string | null
          property_billing_notes?: string | null
          property_city?: string | null
          property_grade?: string | null
          property_management_group?: string | null
          property_name?: string | null
          property_notes_and_callbacks?: string | null
          property_phone?: string | null
          property_region?: string | null
          property_site_plan?: string | null
          property_state?: string | null
          property_supplies_paint?: string | null
          property_unit_layout?: string | null
          property_zip?: string | null
          quickbooks_qb?: string | null
          state?: string
          status?: Database["public"]["Enums"]["property_status"] | null
          subcontractor_a?: string | null
          subcontractor_b?: string | null
          total_units?: number | null
          unique_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          zip?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "property_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      property_groups: {
        Row: {
          contact_email: string
          contact_name: string
          contact_phone: string | null
          contact_role: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          region: string
          status: Database["public"]["Enums"]["property_status"] | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          contact_role?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          region: string
          status?: Database["public"]["Enums"]["property_status"] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          contact_role?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          region?: string
          status?: Database["public"]["Enums"]["property_status"] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      property_managers: {
        Row: {
          created_at: string | null
          id: string
          property_id: string | null
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          property_id?: string | null
          role: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          property_id?: string | null
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_managers_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_managers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      work_order_details: {
        Row: {
          created_at: string | null
          has_sprinkler_covers: boolean | null
          has_sprinklers: boolean | null
          id: string
          is_full_paint: boolean | null
          is_occupied: boolean | null
          job_id: string | null
          prepared_by: string | null
          sprinklers_have_old_paint: boolean | null
          unit_size: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          has_sprinkler_covers?: boolean | null
          has_sprinklers?: boolean | null
          id?: string
          is_full_paint?: boolean | null
          is_occupied?: boolean | null
          job_id?: string | null
          prepared_by?: string | null
          sprinklers_have_old_paint?: boolean | null
          unit_size: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          has_sprinkler_covers?: boolean | null
          has_sprinklers?: boolean | null
          id?: string
          is_full_paint?: boolean | null
          is_occupied?: boolean | null
          job_id?: string | null
          prepared_by?: string | null
          sprinklers_have_old_paint?: boolean | null
          unit_size?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_order_details_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      work_orders: {
        Row: {
          assigned_to: string | null
          base_amount: number
          created_at: string | null
          has_sprinkler_covers: boolean | null
          has_sprinklers: boolean | null
          id: string
          is_full_paint: boolean | null
          is_occupied: boolean | null
          job_request_id: string | null
          prepared_by: string | null
          sprinklers_have_old_paint: boolean | null
          total_amount: number
          unit_size: string
          updated_at: string | null
          work_order_number: string
        }
        Insert: {
          assigned_to?: string | null
          base_amount: number
          created_at?: string | null
          has_sprinkler_covers?: boolean | null
          has_sprinklers?: boolean | null
          id?: string
          is_full_paint?: boolean | null
          is_occupied?: boolean | null
          job_request_id?: string | null
          prepared_by?: string | null
          sprinklers_have_old_paint?: boolean | null
          total_amount: number
          unit_size: string
          updated_at?: string | null
          work_order_number: string
        }
        Update: {
          assigned_to?: string | null
          base_amount?: number
          created_at?: string | null
          has_sprinkler_covers?: boolean | null
          has_sprinklers?: boolean | null
          id?: string
          is_full_paint?: boolean | null
          is_occupied?: boolean | null
          job_request_id?: string | null
          prepared_by?: string | null
          sprinklers_have_old_paint?: boolean | null
          total_amount?: number
          unit_size?: string
          updated_at?: string | null
          work_order_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_orders_job_request_id_fkey"
            columns: ["job_request_id"]
            isOneToOne: false
            referencedRelation: "job_requests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      associate_file: {
        Args: {
          p_file_id: string
          p_entity_type: string
          p_entity_id: string
          p_association_type: string
        }
        Returns: string
      }
      get_entity_files: {
        Args: {
          p_entity_type: string
          p_entity_id: string
          p_association_type?: string
        }
        Returns: {
          file_id: string
          filename: string
          file_type: Database["public"]["Enums"]["file_type"]
          category: Database["public"]["Enums"]["file_category"]
          size: number
          created_at: string
          uploaded_by: string
          thumbnails: Json
        }[]
      }
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      mark_all_notifications_read: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      mark_notification_read: {
        Args: {
          notification_id: string
        }
        Returns: undefined
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
      unaccent: {
        Args: {
          "": string
        }
        Returns: string
      }
      unaccent_init: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      update_job_phase: {
        Args: {
          job_id: string
          new_phase: Database["public"]["Enums"]["job_phase"]
          reason?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      file_category:
        | "property_photo"
        | "job_photo"
        | "before_photo"
        | "after_photo"
        | "document"
        | "invoice"
        | "contract"
        | "other"
      file_type: "image" | "document" | "pdf" | "other"
      job_phase:
        | "job_request"
        | "work_order"
        | "pending_work_order"
        | "grading"
        | "invoicing"
        | "completed"
        | "cancelled"
      job_type: "paint" | "callback" | "repair"
      property_status: "active" | "inactive"
      user_role:
        | "admin"
        | "jg_management"
        | "property_manager"
        | "subcontractor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
