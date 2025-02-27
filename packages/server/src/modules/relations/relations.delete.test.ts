import {
  clean,
  newMockRequest,
  testErroneousResponse,
} from "@modules/common.test";
import { RelationDoesNotExist } from "@shared/types/errors";
import { Db } from "@service/rethink";
import request from "supertest";
import { apiPath } from "@common/constants";
import app from "../../Server";
import { supertestConfig } from "..";
import Relation from "@models/relation/relation";
import { RelationEnums } from "@shared/enums";
import { pool } from "@middlewares/db";

describe("Relations delete", function () {
  afterAll(async () => {
    await pool.end();
  });

  describe("bad id", () => {
    it("should return a RelationDoesNotExist error wrapped in IResponseGeneric", async () => {
      await request(app)
        .delete(`${apiPath}/relations/randomid12345`)
        .set("authorization", "Bearer " + supertestConfig.token)
        .expect("Content-Type", /json/)
        .expect(
          testErroneousResponse.bind(undefined, new RelationDoesNotExist(""))
        );
    });
  });
  describe("ok data", () => {
    it("should return a 200 code with successful response", async () => {
      const db = new Db();
      await db.initDb();

      const relationEntry = new Relation({
        type: RelationEnums.Type.Superclass,
      });
      await relationEntry.save(db.connection);

      await request(app)
        .delete(`${apiPath}/relations/${relationEntry.id}`)
        .set("authorization", "Bearer " + supertestConfig.token)
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(async () => {
          const deletedEntity = await Relation.getById(
            newMockRequest(db),
            relationEntry.id
          );
          expect(deletedEntity).toBeNull();
        });

      await clean(db);
    });
  });
});
