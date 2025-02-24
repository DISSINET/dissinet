import Entity from "@models/entity/entity";
import Relation from "@models/relation/relation";
import Resource from "@models/resource/resource";
import Value from "@models/value/value";
import { Db } from "@service/rethink";
import { DbEnums, EntityEnums, RelationEnums } from "@shared/enums";
import {
  IAction,
  IConcept,
  IReference,
  IResource,
  IValue,
  Relation as RelationTypes,
} from "@shared/types";
import * as path from "path";
import { Connection, r as rethink } from "rethinkdb-ts";
import { question } from "scripts/import/prompts";
import { v4 as uuidv4 } from "uuid";
import { IJob } from ".";
import Generator from "./Generator";

export async function getEntitiesDataByClass<T>(
  db: Connection,
  entityClass: EntityEnums.Class
): Promise<T[]> {
  const connection = db instanceof Db ? db.connection : db;
  return rethink
    .table(Entity.table)
    .getAll(entityClass, { index: DbEnums.Indexes.Class })
    .run(connection);
}

async function getRelationsWithEntities<T extends RelationTypes.IRelation>(
  db: Connection,
  entityIds: string[],
  relType?: RelationEnums.Type,
  position?: number
): Promise<T[]> {
  const items: T[] = await rethink
    .table(Relation.table)
    .getAll.call(undefined, ...entityIds, {
      index: DbEnums.Indexes.RelationsEntityIds,
    })
    .filter(relType ? { type: relType } : {})
    .distinct()
    .run(db);

  if (position !== undefined) {
    return items.filter((d) => entityIds.indexOf(d.entityIds[position]) !== -1);
  }
  return items;
}

// each exported entity should have referene to this Resoure, which point to original dissinet source
const originResource = new Resource({
  id: "dissinet-resource",
  data: {
    partValueBaseURL: "",
    partValueLabel: "",
    url: "https://dissinet.cz/",
  },
  labels: ["DISSINET Database (DDB1)"],
  language: EntityEnums.Language.English,
  notes: [],
  status: EntityEnums.Status.Approved,
});

class ACRGenerator extends Generator {
  getPath(filename?: string) {
    if (!this.datasetName) {
      throw new Error(
        "Dataset name not yet set, cannot create the path to directory"
      );
    }

    let parts = [__dirname, "..", "..", Generator.DIRECTORY, this.datasetName];
    if (filename) {
      parts.push(filename);
    }
    return path.join.apply(undefined, parts);
  }

  async getUserInfo() {
    const datasetName = await question<string>(
      "Name of the dataset?",
      (input: string): string => input,
      ""
    );

    console.log("Dataset name:", datasetName);
    if (!datasetName) {
      throw new Error("Dataset name should not be empty");
    }
    this.datasetName = datasetName;

    const datasetPath = this.getPath();
    // if (fs.existsSync(datasetPath)) {
    //   throw new Error(`The dataset path (${datasetPath}) already exists`);
    // }
  }
}

const exportACR: IJob = async (db: Connection): Promise<void> => {
  const generator = new ACRGenerator();
  await generator.getUserInfo();

  const values: IValue[] = [];
  const existingReferenceValueIds: string[] = [];

  const acResourceIds: string[] = [];

  // retrieve all actions and push origin resource into list of references
  // +
  // replace original label with the id
  const actions = (
    await getEntitiesDataByClass<IAction>(db, EntityEnums.Class.Action)
  ).map((a) => {
    a.references.forEach((r) => {
      existingReferenceValueIds.push(r.value);

      if (!acResourceIds.includes(r.resource) && r.resource) {
        acResourceIds.push(r.resource);
      }
    });

    const v = new Value({
      id: uuidv4(),
      labels: [a.id],
    });

    a.references.push({
      id: uuidv4(),
      resource: originResource.id,
      value: v.id,
    } as IReference);

    return a;
  });

  // retrieve all concepts and push origin resource into list of references
  // +
  // replace original label with the id
  const concepts = (
    await getEntitiesDataByClass<IConcept>(db, EntityEnums.Class.Concept)
  ).map((c) => {
    c.references.forEach((r) => {
      existingReferenceValueIds.push(r.value);
      if (!acResourceIds.includes(r.resource) && r.resource) {
        acResourceIds.push(r.resource);
      }
    });

    // metaprops
    c.props.forEach((p) => {});

    const v = new Value({
      id: uuidv4(),
      labels: [c.id],
    });
    values.push(v);
    c.references.push({
      id: uuidv4(),
      resource: originResource.id,
      value: v.id,
    } as IReference);
    return c;
  });

  // retrieve all resources
  const resources = (
    await getEntitiesDataByClass<IResource>(db, EntityEnums.Class.Resource)
  )
    .filter((r) => acResourceIds.includes(r.id))
    .map((r) => {
      r.references.forEach((r) => {
        existingReferenceValueIds.push(r.value);
      });

      const v = new Value({
        id: uuidv4(),
        labels: [r.id],
      });

      values.push(v);
      r.references.push({
        id: uuidv4(),
        resource: originResource.id,
        value: v.id,
      } as IReference);
      return r;
    });

  // get all Reference Values from existingReferenceValueIds and merge into values
  const existingReferenceValues = await rethink
    .table(Value.table)
    .getAll(...existingReferenceValueIds)
    .run(db);

  values.push(...existingReferenceValues);

  // allow only relations, which have all entities in lists above
  const allIds = actions
    .map((a) => a.id)
    .concat(concepts.map((c) => c.id))
    .concat(resources.map((r) => r.id));

  const relations = (await getRelationsWithEntities(db, allIds)).filter((r) => {
    // check if all relation entityIds are in allIds
    let matches = 0;
    for (const entityId of r.entityIds) {
      for (const allid of allIds) {
        if (entityId === allid) {
          matches++;
          break;
        }
      }

      if (matches === r.entityIds.length) {
        return true;
      }
    }

    return false;
  });

  generator.entities.entities.A = actions;
  generator.entities.entities.C = concepts;
  generator.entities.entities.V = values;
  generator.entities.entities.R = [originResource, ...resources];

  generator.relations.relations = Object.values(RelationEnums.Type).reduce(
    (acc, type) => {
      acc[type] = relations.filter((r) => r.type === type);
      return acc;
    },
    {} as Record<RelationEnums.Type, RelationTypes.IRelation[]>
  );

  generator.output();
};

export default exportACR;
