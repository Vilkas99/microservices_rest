import { Request, Response, NextFunction } from "express";

import { parent_type, operation_type, element_type } from "../enums";


export interface ICreateModification {
    id_consultant:string, 
    id_parent:string, 
    operation_type: operation_type, 
    element_type: element_type, 
    parent_type: parent_type,
    res: Response
}