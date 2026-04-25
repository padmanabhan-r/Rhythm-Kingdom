// =============================================================================
//  Rhythm Kingdom — GameSceneBuilder.js
//  Level geometry builders extracted from GameScene to keep file under 400 lines.
// =============================================================================

window.RK.GameSceneBuilder = {

  buildPlatforms(scene, ld) {
    ld.platforms.forEach(p => {
      const w = p.w, h = 20, gfx = scene.add.graphics().setDepth(1);
      if (p.type === 'ceiling') {
        gfx.fillStyle(0x2a2015); gfx.fillRect(p.x, p.y, w, h);
        gfx.fillStyle(0x1a1408); gfx.fillRect(p.x, p.y + h - 4, w, 4);
        gfx.fillStyle(0x1a4020); gfx.fillRect(p.x + 10, p.y + h, 4, 20);
        gfx.fillRect(p.x + 30, p.y + h, 3, 14); gfx.fillRect(p.x + 60, p.y + h, 5, 18);
        const body = scene.ceilingGroup.create(p.x + w / 2, p.y + h / 2, 'px');
        body.setDisplaySize(w, h).setAlpha(0).refreshBody();
        return;
      }
      if (p.type === 'creeper') {
        gfx.fillStyle(0x2a5a1a); gfx.fillRect(p.x + 24, p.y, 6, 60);
        gfx.fillStyle(0x3a7a2a); gfx.fillRect(p.x + 25, p.y, 4, 58);
        gfx.fillStyle(0x1a5a1a); gfx.fillEllipse(p.x + 27, p.y + 50, 22, 16);
        gfx.fillStyle(0x228833); gfx.fillEllipse(p.x + 27, p.y + 48, 18, 13);
        gfx.fillStyle(0x33aa44); gfx.fillEllipse(p.x + 27, p.y + 46, 12, 8);
        gfx.fillStyle(0x2a6a22); gfx.fillEllipse(p.x + 12, p.y + 44, 12, 7);
        gfx.fillEllipse(p.x + 44, p.y + 50, 12, 7);
        gfx.fillEllipse(p.x + 8, p.y + 58, 10, 6);
        gfx.fillEllipse(p.x + 46, p.y + 60, 10, 6);
        gfx.fillStyle(0x44cc44, 0.5); gfx.fillEllipse(p.x + 11, p.y + 43, 7, 4);
        gfx.fillEllipse(p.x + 43, p.y + 49, 7, 4);
        gfx.fillStyle(0x1a4010); gfx.fillRect(p.x + 24, p.y + 44, 3, 10);
        gfx.fillRect(p.x + 28, p.y + 44, 3, 8);
        const body = scene.ceilingGroup.create(p.x + p.w / 2, 503, 'px');
        body.setDisplaySize(p.w, 22).setAlpha(0).refreshBody();
        return;
      }
      if (p.type === 'gate') {
        const wx = p.x, wallW = p.w, floorY = p.y;
        // Tall stone pillar — stops 22px above floor, leaving roll gap
        const pillarH = floorY - 22;
        gfx.fillStyle(0x2a2015); gfx.fillRect(wx, 0, 26, pillarH);
        gfx.fillStyle(0x3a2e1a); gfx.fillRect(wx, 0, 24, pillarH);
        gfx.fillStyle(0x4a3c26); gfx.fillRect(wx + 2, 0, 20, pillarH - 2);
        gfx.fillStyle(0x2a2015); gfx.fillRect(wx + 5, pillarH - 26, 16, 3);
        gfx.fillRect(wx + 5, pillarH - 8,  16, 3);
        gfx.fillRect(wx + 5, pillarH - 58, 16, 3);
        // Single pillar only
        const lPillar = scene.wallGroup.create(wx + 13, 238, 'px');
        lPillar.setDisplaySize(26, 476).setAlpha(0).refreshBody();
        return;
      }
      // Jungle platform: moss top + carved stone base
      gfx.fillStyle(0x1a4a22); gfx.fillRect(p.x, p.y, w, 6);
      gfx.fillStyle(0x228833); gfx.fillRect(p.x + 1, p.y + 1, w - 2, 3);
      gfx.fillStyle(0x33aa44); gfx.fillRect(p.x + 2, p.y + 1, w - 4, 1);
      gfx.fillStyle(0x3a2e1a); gfx.fillRect(p.x, p.y + 6, w, h - 6);
      gfx.fillStyle(0x4a3c26); gfx.fillRect(p.x + 1, p.y + 7, w - 2, 4);
      gfx.fillStyle(0x2a2015); gfx.fillRect(p.x, p.y + h - 3, w, 3);
      gfx.fillStyle(0xcc9933, 0.5);
      for (let rx = p.x + 20; rx < p.x + w - 10; rx += 32) {
        gfx.fillRect(rx, p.y + 9, 8, 2);
      }
      const body = scene.platformGroup.create(p.x + w / 2, p.y + h / 2, 'px');
      body.setDisplaySize(w, h).setAlpha(0).refreshBody();
    });
  },

  buildThorns(scene, ld) {
    const thorns = ld.thorns || ld.spikes || [];
    const hasImg = scene.textures.exists('jungle_trap');
    thorns.forEach(s => {
      if (hasImg) {
        scene.add.image(s.x + 8, s.y + 8, 'jungle_trap').setDepth(1).setScale(1);
      } else {
        const gfx = scene.add.graphics().setDepth(1);
        gfx.fillStyle(0x1a5c18); gfx.fillTriangle(s.x + 8, s.y, s.x, s.y + 20, s.x + 16, s.y + 20);
        gfx.fillStyle(0x228822); gfx.fillTriangle(s.x + 8, s.y + 3, s.x + 2, s.y + 20, s.x + 14, s.y + 20);
        gfx.fillStyle(0x44cc44); gfx.fillRect(s.x + 7, s.y + 3, 2, 5);
      }
      const body = scene.thornGroup.create(s.x + 8, s.y + 10, 'px');
      body.setDisplaySize(12, 16).setAlpha(0).refreshBody();
    });
  },

  buildWater(scene, ld) {
    (ld.water || []).forEach(w => {
      const gfx = scene.add.graphics().setDepth(0);
      gfx.fillStyle(0x0a3d5c); gfx.fillRect(w.x, w.y, w.w, w.h);
      gfx.fillStyle(0x1a6688); gfx.fillRect(w.x, w.y, w.w, 18);
      gfx.fillStyle(0x22aacc, 0.7); gfx.fillRect(w.x, w.y, w.w, 7);
      gfx.fillStyle(0x66eeff, 0.35); gfx.fillRect(w.x + 4, w.y + 2, w.w - 8, 4);
      if (scene.textures.exists('water_tile')) {
        const spr = scene.add.tileSprite(w.x, w.y, w.w, 16, 'water_tile')
          .setOrigin(0, 0).setDepth(1).setAlpha(0.85);
        scene._waterTiles = scene._waterTiles || [];
        scene._waterTiles.push(spr);
      }
      const body = scene.waterGroup.create(w.x + w.w / 2, w.y + w.h / 2, 'px');
      body.setDisplaySize(w.w, w.h).setAlpha(0).refreshBody();
    });
  },

  buildEnemies(scene, ld) {
    (ld.enemies || []).forEach(e => {
      const enemy = new RK.Enemy(scene, e.x, e.y, e.type);
      const patrol = e.patrol || [e.x - 64, e.x + 64];
      enemy.setPatrol(patrol[0], patrol[1]);
      scene.enemyGroup.add(enemy);
    });
  },

  buildBananas(scene, ld) {
    (ld.bananas || []).forEach((b, i) => {
      const key = 'fruit_' + (i % 2);
      const spr = scene.physics.add.sprite(b.x, b.y, key);
      spr.setScale(0.9);
      spr.body.setAllowGravity(false);
      spr.body.setImmovable(true);
      spr.setDepth(3);
      scene.tweens.add({
        targets: spr, y: b.y - 7,
        duration: 900, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
        delay: (i * 120) % 600,
      });
      scene.bananaGroup.add(spr);
    });
  },

  buildPickups(scene, ld) {
    (ld.pickups || []).forEach(p => {
      const iconKey = 'action_' + (p.unlocks || 'coconut').toLowerCase();
      const tex = scene.textures.exists(iconKey) ? iconKey : 'relic_shard';
      const sprite = scene.physics.add.sprite(p.x, p.y, tex);
      sprite.setScale(0.7);
      sprite.body.setAllowGravity(false);
      sprite.body.setImmovable(true);
      sprite.setDepth(3);
      sprite.setData('unlocks', p.unlocks);
      scene.tweens.add({
        targets: sprite, y: p.y - 10,
        duration: 1000, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
      });
      // Gentle glow pulse instead of spinning
      scene.tweens.add({
        targets: sprite, alpha: { from: 1, to: 0.6 },
        duration: 800, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
        delay: 200,
      });
      scene.pickupGroup.add(sprite);
    });
  },

  buildCheckpoints(scene, ld) {
    (ld.checkpoints || []).forEach((cp, i) => {
      const gfx = scene.add.graphics().setDepth(2);
      gfx.fillStyle(0x4a4035); gfx.fillRect(cp.x, cp.y, 24, 40);
      gfx.fillStyle(0x44ffaa); gfx.fillRect(cp.x + 10, cp.y + 8, 4, 24);
      gfx.fillRect(cp.x + 8, cp.y + 8, 8, 4);
      gfx.fillRect(cp.x + 8, cp.y + 20, 8, 4);
      const zone = scene.physics.add.sprite(cp.x + 12, cp.y + 20, 'px');
      zone.setAlpha(0);
      if (zone.body) {
        zone.body.setSize(24, 40).setAllowGravity(false);
      }
      zone.setData('cpIndex', i);
      zone.setData('cpX', cp.x + 12);
      zone.setData('cpY', cp.y);
      scene.checkpointGroup.push(zone);
    });
  },

  buildSigns(scene, ld) {
    (ld.signs || []).forEach(s => {
      const gfx = scene.add.graphics().setDepth(4);
      // Stake
      gfx.fillStyle(0x5a3810); gfx.fillRect(s.x - 1, s.y - 40, 3, 42);
      // Board
      gfx.fillStyle(0x7a4e18); gfx.fillRect(s.x - 54, s.y - 72, 108, 34);
      gfx.fillStyle(0x9a6628); gfx.fillRect(s.x - 52, s.y - 70, 104, 30);
      gfx.lineStyle(1, 0x4a2e08); gfx.strokeRect(s.x - 54, s.y - 72, 108, 34);
      // Corner nails
      gfx.fillStyle(0xccaa44);
      [[s.x-50,s.y-68],[s.x+50,s.y-68],[s.x-50,s.y-42],[s.x+50,s.y-42]]
        .forEach(([nx,ny]) => gfx.fillCircle(nx,ny,2));
      // Text
      scene.add.text(s.x, s.y - 55, s.text, {
        fontSize: s.small ? '7px' : '8px',
        color: '#2a1408', fontFamily: 'monospace', fontStyle: 'bold',
        align: 'center',
      }).setOrigin(0.5).setDepth(5);
    });
  },

  buildExit(scene, ld) {
    const ex = ld.exit;
    scene.add.image(ex.x + 24, ex.y - 28, 'exit_arch').setDepth(2);
    scene.tweens.add({
      targets: scene.add.rectangle(ex.x + 24, ex.y - 8, 24, 48, RK.COLORS.JADE, 0.2)
        .setDepth(2),
      alpha: { from: 0.1, to: 0.5 },
      duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });
    scene.exitZone = scene.physics.add.sprite(ex.x + 24, ex.y - 8, 'px');
    scene.exitZone.setAlpha(0);
    if (scene.exitZone.body) {
      scene.exitZone.body.setSize(30, 60).setAllowGravity(false);
    }
  },

};
