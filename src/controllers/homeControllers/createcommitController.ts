import { Request, Response } from "express";
import { validationResult } from "express-validator";
import pool from "../../db";

export const createcommitController = async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(422).json({ validation_errors: result.array() });
    return;
  }

  const {
    commit,
    _id: user_id,
    tag,
    tag_color,
    branch_id,
    mutation_level,
  } = req.body;

  const client = await pool.connect();

  try {
    const user = await client.query(
      `SELECT _id 
      FROM users 
      WHERE _id = $1`,
      [user_id]
    );
    if (user.rowCount === 0) {
      res.status(403).json({ message: "User doesn't exist" });
      return;
    }

    await client.query("BEGIN");

    const branchResult = await client.query(
      `SELECT * 
      FROM branches 
      WHERE _id = $1`,
      [branch_id]
    );

    const data = branchResult.rows[0];
    if (data.user_id !== user_id) {
      await client.query("ROLLBACK");
      res.status(403).json({
        error: "You are not authorized to access this resource",
      });
      return;
    }

    const commitResult = await client.query(
      `INSERT INTO commits(commit, time_created, tag, mutation_level, tag_color, branch_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING _id`,
      [commit, new Date(), tag, mutation_level, tag_color, branch_id]
    );

    const commit_id = commitResult.rows[0]._id;
    await client.query(
      `UPDATE branches 
      SET latest_commit = $1 
      WHERE _id = $2`,
      [commit_id, branch_id]
    );

    await client.query(
      `
        UPDATE commits
        SET mutated_to = $1
        WHERE _id = $2
        `,
      [commit_id, data.latest_commit]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Commit and created successfully",
      data: {
        commit_id,
      },
    });
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

export const createnewcommitController = async (
  req: Request,
  res: Response
) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(422).json({ validation_errors: result.array() });
    return;
  }

  const { commit, _id: user_id, tag, tag_color } = req.body;

  const client = await pool.connect();

  try {
    const user = await client.query(
      `SELECT _id 
      FROM users 
      WHERE _id = $1`,
      [user_id]
    );
    if (user.rowCount === 0) {
      res.status(403).json({ message: "User doesn't exist" });
      return;
    }

    await client.query("BEGIN");
    const branchResult = await client.query(
      `INSERT INTO branches(user_id, status) 
      VALUES ($1, $2) 
      RETURNING _id`,
      [user_id, "Active"]
    );

    const branch_id = branchResult.rows[0]._id;
    const commitResult = await client.query(
      `INSERT INTO commits(commit, time_created, tag, mutation_level, tag_color, branch_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING _id`,
      [commit, new Date(), tag, 0, tag_color, branch_id]
    );

    const commit_id = commitResult.rows[0]._id;
    await client.query(
      `UPDATE branches 
      SET latest_commit = $1 
      WHERE _id = $2`,
      [commit_id, branch_id]
    );

    await client.query("COMMIT");
    res.status(201).json({
      message: "Commit and branch created successfully",
      data: {
        branch_id,
        commit_id,
      },
    });
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};
