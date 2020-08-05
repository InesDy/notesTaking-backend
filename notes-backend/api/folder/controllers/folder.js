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
      entities = await strapi.services.folder.search(ctx.query);
    } else {
      entities = await strapi.services.folder.find(ctx.query);
    }

    return entities.map((entity) => {
      const folder = sanitizeEntity(entity, {
        model: strapi.models.folder,
      });

      return folder;
    });
  },

  // FIND ONE

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.folder.findOne({
      id,
      "user.id": ctx.state.user.id,
    });
    const folder = sanitizeEntity(entity, { model: strapi.models.folder });

    return folder;
  },

  // CREATE
  //ctx has query and state (info about user)
  // we pass the  user id to  the database query

  async create(ctx) {
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      data.user = ctx.state.user.id;
      entity = await strapi.services.folder.create(data, { files });
    } else {
      ctx.request.body.user = ctx.state.user.id;
      entity = await strapi.services.folder.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.folder });
  },

  //UPDATE
  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    const [folder] = await strapi.services.folder.find({
      id,
      "user.id": ctx.state.user.id,
    });

    if (!folder) {
      return ctx.unuserized(`You can't update this entry`);
    }

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.folder.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.folder.update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.note });
  },

  // DELETE

  async delete(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.folder.delete({
      id,
      "user.id": ctx.state.user.id,
    });
    return sanitizeEntity(entity, { model: strapi.models.note });
  },
};
