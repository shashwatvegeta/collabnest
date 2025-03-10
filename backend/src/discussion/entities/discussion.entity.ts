import { Types } from 'mongoose';

export class Discussion {

    title: string;


    description: string;


    topic: string; // Using string type instead of enum


    project_id: string;
}