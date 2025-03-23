export class CreateProjectDto {
  project_name: string;
  project_id: number;
  is_approved: string;
  description: string;
  //is_completed: boolean;
  cap: number;
  start_date: Date;
  end_date: Date;
  //discussion_threads: Object[];
  //tags: Object[];
  project_owner: {
    user_type: string;
    [key: string]: any;
  };
  //students_enrolled: Object[];
  //tasks: Object[];
  //project_application: Object[];
}
