"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    let entities;

    //FIND ALL

    ctx.query.user = ctx.state.user.id;

    if (ctx.query._q) {
      entities = await strapi.services.note.search(ctx.query);
    } else {
      entities = await strapi.services.note.find(ctx.query);
    }

    return entities.map((entity) => {
      const note = sanitizeEntity(entity, {
        model: strapi.models.note,
      });

      return note;
    });
  },

  // FIND ONE

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.note.findOne({
      id,
      "user.id": ctx.state.user.id,
    });
    const note = sanitizeEntity(entity, { model: strapi.models.note });

    return note;
  },

  // CREATE
  //ctx has query and state (info about user)
  // 36 we pass the  user id to  the database query

  async create(ctx) {
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      data.user = ctx.state.user.id;
      entity = await strapi.services.note.create(data, { files });
    } else {
      ctx.request.body.user = ctx.state.user.id;
      entity = await strapi.services.note.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.note });
  },

  //UPDATE
  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    const [note] = await strapi.services.note.find({
      id,
      "user.id": ctx.state.user.id,
    });

    if (!note) {
      return ctx.unuserized(`You can't update this entry`);
    }

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.note.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.note.update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.note });
  },

  // DELETE

  async delete(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.note.delete({
      id,
      "user.id": ctx.state.user.id,
    });
    return sanitizeEntity(entity, { model: strapi.models.note });
  },
};
