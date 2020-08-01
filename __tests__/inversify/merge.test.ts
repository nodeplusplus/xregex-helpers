import "reflect-metadata";
import _ from "lodash";
import { injectable, Container, interfaces } from "inversify";

import { merge } from "../../src/inversify";

@injectable()
class Ninja {
  public name = "Ninja";
}

@injectable()
class Shuriken {
  public name = "Shuriken";
}

const CHINA_EXPANSION_TYPES = {
  Ninja: "Ninja",
  Shuriken: "Shuriken",
};

@injectable()
class Samurai {
  public name = "Samurai";
}

@injectable()
class Katana {
  public name = "Katana";
}

const JAPAN_EXPANSION_TYPES = {
  Katana: "Katana",
  Samurai: "Samurai",
};

describe("inversify/merge", () => {
  it("should merge 2 containers to container - which has default options", () => {
    const chinaExpansionContainer = new Container();
    chinaExpansionContainer.bind<Ninja>(CHINA_EXPANSION_TYPES.Ninja).to(Ninja);
    chinaExpansionContainer
      .bind<Shuriken>(CHINA_EXPANSION_TYPES.Shuriken)
      .to(Shuriken);

    const japanExpansionContainer = new Container();
    japanExpansionContainer
      .bind<Samurai>(JAPAN_EXPANSION_TYPES.Samurai)
      .to(Samurai);
    japanExpansionContainer
      .bind<Katana>(JAPAN_EXPANSION_TYPES.Katana)
      .to(Katana);

    const gameContainer = merge(
      chinaExpansionContainer,
      japanExpansionContainer
    );
    expect(gameContainer.get<Ninja>(CHINA_EXPANSION_TYPES.Ninja).name).toBe(
      "Ninja"
    );
    expect(
      gameContainer.get<Shuriken>(CHINA_EXPANSION_TYPES.Shuriken).name
    ).toBe("Shuriken");
    expect(gameContainer.get<Samurai>(JAPAN_EXPANSION_TYPES.Samurai).name).toBe(
      "Samurai"
    );
    expect(gameContainer.get<Katana>(JAPAN_EXPANSION_TYPES.Katana).name).toBe(
      "Katana"
    );

    expect(gameContainer.options.defaultScope).toBe("Transient");
  });

  it("should merge 2 containers to container with our options", () => {
    const chinaExpansionContainer = new Container();
    chinaExpansionContainer.bind<Ninja>(CHINA_EXPANSION_TYPES.Ninja).to(Ninja);
    chinaExpansionContainer
      .bind<Shuriken>(CHINA_EXPANSION_TYPES.Shuriken)
      .to(Shuriken);

    const japanExpansionContainer = new Container();
    japanExpansionContainer
      .bind<Samurai>(JAPAN_EXPANSION_TYPES.Samurai)
      .to(Samurai);
    japanExpansionContainer
      .bind<Katana>(JAPAN_EXPANSION_TYPES.Katana)
      .to(Katana);

    const options: interfaces.ContainerOptions = {
      defaultScope: "Singleton",
    };
    const gameContainer = merge(
      chinaExpansionContainer,
      japanExpansionContainer,
      options
    );
    expect(gameContainer.get<Ninja>(CHINA_EXPANSION_TYPES.Ninja).name).toBe(
      "Ninja"
    );
    expect(
      gameContainer.get<Shuriken>(CHINA_EXPANSION_TYPES.Shuriken).name
    ).toBe("Shuriken");
    expect(gameContainer.get<Samurai>(JAPAN_EXPANSION_TYPES.Samurai).name).toBe(
      "Samurai"
    );
    expect(gameContainer.get<Katana>(JAPAN_EXPANSION_TYPES.Katana).name).toBe(
      "Katana"
    );

    expect(_.pick(gameContainer.options, Object.keys(options))).toEqual(
      options
    );
  });
});
