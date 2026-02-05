package ma.time.traker.api.domain;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "persons")
public class Person extends PanacheEntityBase {
  @Id
  public UUID id;
  public String name;
  public Integer age;
  @CreationTimestamp
  @Column(name = "created_At")
  public LocalDateTime createdAt;
  @UpdateTimestamp
  @Column(name = "updated_at")
  public LocalDateTime updatedAt;
}
